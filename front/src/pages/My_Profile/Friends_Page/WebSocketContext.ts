import { createContext } from "react";

interface Message {
  id: number;
  text: string;
  sent: boolean;
  avatar: string;
  timestamp: number;
  sender: string;
  receiver: string;
}

export interface WebSocketContextType {
  messages: Message[];
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: { username: string; message: string }) => void;
  currentUser?: string;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);
