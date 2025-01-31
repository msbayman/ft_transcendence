import React from "react";
import { WebSocketProvider } from "./WebSocketContext";
import FriendsPageContent from "./FriendsPageContent";

const Friends_Page: React.FC = () => {
  return (
    <WebSocketProvider>
      <FriendsPageContent />
    </WebSocketProvider>
  );
};

export default Friends_Page;
