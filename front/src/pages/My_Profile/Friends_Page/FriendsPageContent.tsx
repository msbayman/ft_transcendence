import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWebSocket } from "./useWebSocket";
import ChatContainer from "./ChatContainer";
import { config } from "../../../config";

const FriendsPageContent: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUser = queryParams.get("user") || "";

  const [user, setUser] = useState<string>(initialUser);
  const { connect, disconnect } = useWebSocket();
    const {  WS_HOST_URL } = config;

  useEffect(() => {
    const wsUrl = `${WS_HOST_URL}/ws/chat/`;
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleUser = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <div className="flex flex-row w-[1600px] h-full drop-shadow-2xl rounded-l-[44px] rounded-r-[44px] bg-[#3A0CA3]">
      <ChatContainer user={user} onUserSelect={handleUser} />
    </div>
  );
};

export default FriendsPageContent;
