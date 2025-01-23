import React, { createContext, useContext, useState, useCallback } from 'react';
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
  win_1_game:boolean;
  win_3_games:boolean;
  win_10_games:boolean;
  win_30_games:boolean;
  reach_level_5:boolean;
  reach_level_15:boolean;
  reach_level_30:boolean;
  perfect_win_game:boolean;
  perfect_win_tournaments:boolean;
}

interface PlayerContextType {
  playerData: PlayerData | null;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData | null>>;
  isLoading: boolean;
  fetchPlayerData: () => Promise<void>;
  clearPlayerData: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlayerData = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user_auth/UserDetailView", 
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

  const clearPlayerData = useCallback(() => {
    setPlayerData(null);
  }, []);

  return (
    <PlayerContext.Provider 
      value={{ 
        playerData, 
        setPlayerData, 
        isLoading,
        fetchPlayerData,
        clearPlayerData
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