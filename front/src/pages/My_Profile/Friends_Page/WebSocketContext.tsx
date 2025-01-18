import React, { createContext, useState, useContext, useRef } from "react";
import Cookies from "js-cookie";
import Alert from '@mui/material/Alert';
import { usePlayer } from '../PlayerContext';


interface Message {
  id: number;
  text: string;
  sent: boolean;
  avatar: string;
  timestamp: number;
  sender: string;
  receiver: string;
}

interface WebSocketContextType {
  messages: Message[];
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: { username: string; message: string }) => void;
  currentUser?: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const PlayerInstance = usePlayer()
  const [messages, setMessages] = useState<Message[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);
  const [ErrorPopUp, setErrorPopUp] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');
  const currentUser = PlayerInstance.playerData?.username

  const connect = (url: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) return;

    const token = Cookies.get("access_token");
    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message is :", data);

        if (data.type === 'block_error' || data.error) {
          const errorMessage = data.message || data.error;
          setBlockedMessage(errorMessage);
          setErrorPopUp(true);
          setTimeout(() => setErrorPopUp(false), 3000);
          return;
        }

        if (data.message) {  // Only process if it's a valid message
          const newMessage: Message = {
            id: data.id,
            text: data.message,
            sent: data.sender === currentUser,
            avatar: "default-avatar.png",
            timestamp: data.timestamp,
            sender: data.sender,
            receiver: data.receiver
          };

          setMessages((prev) => {
            const isDuplicate = prev.some(msg => msg.id === newMessage.id);
            if (isDuplicate) return prev;
            return [...prev, newMessage].sort((a, b) => a.id - b.id);
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };


    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setTimeout(() => connect(url), 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      ws.close();
    };

    websocketRef.current = ws;
  };

  const disconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  };

  const sendMessage = (message: { username: string; message: string }) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message); // Debug log
      websocketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, connect, disconnect, sendMessage, currentUser }}>
      {children}
      {ErrorPopUp && (
        <Alert  className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300" variant="filled" severity="error">
        <p>{blockedMessage}</p>
      </Alert>
      )}
    </WebSocketContext.Provider>
  );
};


export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};