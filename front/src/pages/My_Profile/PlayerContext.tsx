import React, { createContext, useContext, useState, useCallback, useRef, useEffect  } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { config } from "../../config";

interface UserOnline {
  username: string;
  profile_image: string;
  is_online: boolean;
}


interface PlayerData {
  full_name: string;
  username: string;
  email: string;
  profile_image: string;
  cover_image: string;
  points: number;
  total_games: number;
  win_games: number;
  lose_games: number;
  level: number;
  win_1_game:boolean;
  win_3_games:boolean;
  win_10_games:boolean;
  win_30_games:boolean;
  reach_level_5:boolean;
  reach_level_15:boolean;
  reach_level_30:boolean;
  perfect_win_game:boolean;
  perfect_win_tournaments:boolean;
  active_2fa:boolean;
  onlineFriends: string[];
}

interface PlayerContextType {
  playerData: PlayerData | null;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData | null>>;
  isLoading: boolean;
  fetchPlayerData: () => Promise<void>;
  clearPlayerData: () => void;
  ws: WebSocket | null;
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  wsConnection: () => void;
  closeWsConnection: () => void;
  onlineFriends: UserOnline[];
}

interface WebSocketMessage {
  type: string;
  username: string;
  profile_image?: string;
  online?: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<UserOnline[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
   const { HOST_URL, WS_HOST_URL } = config;



  const fetchPlayerData = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) {
        return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${HOST_URL}/api/user_auth/UserDetailView`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlayerData(response.data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      setPlayerData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPlayerData = useCallback(() => {
    setPlayerData(null);
    setOnlineFriends([]);
    closeWsConnection();
  }, []);

  const wsConnection = useCallback(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      return;
    }

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = `${WS_HOST_URL}/ws/notifications/?token=${token}`;
    const newWs = new WebSocket(wsUrl);
    wsRef.current = newWs;

    newWs.onopen = () => {
      setWs(newWs);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        
        if (data.username === playerData?.username) {
          return;
        }

        if (data.type === "friend_status" && typeof data.online === 'boolean') {
          setOnlineFriends((prev) => {
            const exists = prev.find((friend) => friend.username === data.username);
            if (data.online && !exists) {
              return [
                ...prev,
                {
                  username: data.username,
                  profile_image: data.profile_image|| "default_profile_image_url", // Fallback for undefined
                  is_online: true,
                },
              ];
            } else if (!data.online && exists) {
              return prev.filter((friend) => friend.username !== data.username);
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    newWs.onerror = (error) => {
      console.error("notif WebSocket error:", error);
    };

    newWs.onclose = () => {
      wsRef.current = null;
      setWs(null);
      setTimeout(() => {setWs(null)}, 5000)
    };
  }, [playerData?.username]);

  const closeWsConnection = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
    setWs(null);
  }, []);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
        wsConnection();
    } else {
        closeWsConnection();
    }
}, [wsConnection, closeWsConnection]);


  useEffect(() => {
    return () => {
      closeWsConnection();
    };
  }, [closeWsConnection]);

  return (
    <PlayerContext.Provider
      value={{
        playerData,
        setPlayerData,
        isLoading,
        fetchPlayerData,
        clearPlayerData,
        ws,
        setWs,
        wsConnection,
        closeWsConnection,
        onlineFriends,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
