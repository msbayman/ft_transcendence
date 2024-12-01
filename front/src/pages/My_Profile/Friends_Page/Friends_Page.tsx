import React from "react";
import "./Friends_Page.css";
// import ChatLayout from "./ChatLayout";
import FriendsList from "./FriendsList";
import ChatInterface from "./test";
export const Friends_Page = () => {
  return (
    <>
      <ChatInterface></ChatInterface>
      <FriendsList></FriendsList>
    </>
  );
};

export default Friends_Page;
