import React, { useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import Alert from '@mui/material/Alert';
import { usePlayer } from '../PlayerContext';
import { WebSocketContext } from "./WebSocketContext";  // Import the context

interface Message {
  id: number;
  text: string;
  sent: boolean;
  avatar: string;
  timestamp: number;
  sender: string;
  receiver: string;
}
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const PlayerInstance = usePlayer();
  const [messages, setMessages] = useState<Message[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);
  const [ErrorPopUp, setErrorPopUp] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');
  const currentUser = PlayerInstance.playerData?.username;

  const connect = useCallback((url: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) return;

    const token = Cookies.get("access_token");
    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'error') {
          setBlockedMessage(data.message);
          setErrorPopUp(true);
          setTimeout(() => setErrorPopUp(false), 3000);
          return;
        }

        if (data.message) {
          const newMessage: Message = {
            id: data.id,
            text: data.message,
            sent: data.sender === currentUser,
            avatar: "default-avatar.png",
            timestamp: data.timestamp,
            sender: data.sender,
            receiver: data.receiver,
          };

          setMessages((prev) => {
            const isDuplicate = prev.some(msg => msg.id === newMessage.id);
            return isDuplicate ? prev : [...prev, newMessage].sort((a, b) => a.id - b.id);
          });
        }
      } catch (error) {
        console.error("Error parsing chat WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("chat WebSocket Error:", error);
      ws.close();
    };

    websocketRef.current = ws;
  }, [currentUser]);

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  }, []);

  const sendMessage = (message: { username: string; message: string }) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, connect, disconnect, sendMessage, currentUser }}>
      {children}
      {ErrorPopUp && (
        <Alert className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300" variant="filled" severity="error">
          <p>{blockedMessage}</p>
        </Alert>
      )}
    </WebSocketContext.Provider>
  );
};
