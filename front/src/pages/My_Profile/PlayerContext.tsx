import React, { createContext, useContext, useState, useCallback  } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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
}

interface PlayerContextType {
  playerData: PlayerData | null;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData | null>>;
  isLoading: boolean;
  fetchPlayerData: () => Promise<void>;
  clearPlayerData: () => void;
  wsConnection: () => void;
  closeWsConnection: () => void;
  sendChallenge: (opponent:string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const fetchPlayerData = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user_auth/UserDetailView",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlayerData(response.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
      setPlayerData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendChallenge = useCallback((opponent:string) => {
    console.log("challenge user hh", opponent, ws)
    if (ws)
      {
      console.log("challenge user hh", opponent)
    }
  }, [ws]);

  const clearPlayerData = useCallback(() => {
    setPlayerData(null);
  }, []);

  const wsConnection = useCallback(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/notifications/?token=${token}`;
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log('notifacation WebSocket connected');
      setWs(newWs);
    };

    newWs.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

  }, []);

  const closeWsConnection = useCallback(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      setWs(null);
      console.log("notifacation WebSocket disconnected");
    }
  }, [ws]);

  return (
    <PlayerContext.Provider 
      value={{ 
        playerData, 
        setPlayerData, 
        isLoading,
        fetchPlayerData,
        clearPlayerData,
        wsConnection,
        closeWsConnection,
        sendChallenge
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};