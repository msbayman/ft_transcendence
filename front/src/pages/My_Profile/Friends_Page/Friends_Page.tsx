import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUser = queryParams.get('user') || '';

  const [user, setUser] = useState<string>(initialUser);
  const { connect, disconnect } = useWebSocket();

  useEffect(() => {
    const wsUrl = "wss://localhost/ws/chat/";
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, []);

  const handleUser = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <div className="flex flex-row w-[1600px] h-full drop-shadow-2xl rounded-l-[44px] rounded-r-[44px] bg-[#3A0CA3]">
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
