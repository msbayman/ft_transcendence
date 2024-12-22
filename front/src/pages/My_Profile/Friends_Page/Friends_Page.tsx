

import React, { useState } from 'react';
import "./Friends_Page.css";
// import Component from './testfetch';
import FriendsList from "./FriendsList";
import ChatInterface from "./test";
// import Messages from "./fetch";





export const Friends_Page: React.FC = () => {
  const [user ,setUser] = useState<string>('alae');
  const handelUser = (newUser:string) => {
    setUser(newUser);
  }
  return (
    <>
      {/* <Component></Component> */}
      <ChatInterface value={user}/>
      {/* <UserList></UserList> */}
      <FriendsList onClick={handelUser}/>
      {/* <Messages></Messages> */}
    </>
  );
};

export default Friends_Page;
