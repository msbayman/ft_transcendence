import React from "react";
import "./Friends_Page.css";
import UserList from "./UserList";
// import ChatLayout from "./ChatLayout";
// import FriendsList from "./FriendsList";
import ChatInterface from "./test";

export const Friends_Page = () => {
  return (
    <>
      <ChatInterface></ChatInterface>
      <UserList></UserList>
      {/* <FriendsList></FriendsList> */}
    </>
  );
};

export default Friends_Page;
