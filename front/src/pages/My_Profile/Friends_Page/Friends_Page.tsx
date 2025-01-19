import React, { useState, useEffect } from "react";
import "./Friends_Page.css";
import FriendsList from "./FriendsList";
import ChatInterface from "./ChatLayout";
import { WebSocketProvider, useWebSocket } from "./WebSocketContext";

interface ChatContainerProps {
  user: string;
  onUserSelect: (newUser: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  user,
  onUserSelect,
}) => {
  return (
    <>
      <ChatInterface value={user} />
      <FriendsList onClick={onUserSelect} />
    </>
  );
};

const Friends_Page_Content: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const { connect, disconnect } = useWebSocket();

  useEffect(() => {
    const wsUrl = "ws://backend/ws/chat/";
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, []);

  const handleUser = (newUser: string) => {
    console.log("Setting new user:", newUser);
    setUser(newUser);
  };

  return (
    <div className="flex w-full h-full drop-shadow-2xl rounded-l-[44px] rounded-r-[44px] bg-[#3A0CA3]">
      <ChatContainer user={user} onUserSelect={handleUser} />
    </div>
  );
};

export const Friends_Page: React.FC = () => {
  return (
    <WebSocketProvider>
      <Friends_Page_Content />
    </WebSocketProvider>
  );
};

export default Friends_Page;
