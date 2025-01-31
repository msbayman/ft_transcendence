import React from "react";
import FriendsList from "./FriendsList";
import ChatInterface from "./ChatLayout";

interface ChatContainerProps {
  user: string;
  onUserSelect: (newUser: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ user, onUserSelect }) => {
  return (
    <>
      <ChatInterface value={user} />
      <FriendsList onClick={onUserSelect} />
    </>
  );
};

export default ChatContainer;
