import React from "react";
import FriendsPageContent from "./FriendsPageContent";
import { WebSocketProvider } from "./WebSocketContext.tsx"

const Friends_Page: React.FC = () => {
  return (
    <WebSocketProvider>
      <FriendsPageContent />
    </WebSocketProvider>
  );
};

export default Friends_Page;
