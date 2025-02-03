import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from "axios";
import { useWebSocket } from './useWebSocket';
import { config } from "../../../config";
// import { useWebSocket } from "./WebSocketContext";;


interface Friend {
  id: string;
  name: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface LastMessage {
  content: string;
}

interface User2 {
  username: string;
  profile_image: string;
}

interface ChatData {
  user2: User2;
  last_message: LastMessage;
  timestamp: string;
}



interface OnlineFriends {
  id: string;
  username: string;
  profile_image: string;
}

interface SelectedUser {
  onClick: (newUser: string) => void;
}
const FriendsList: React.FC<SelectedUser> = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<OnlineFriends[]>([]);
  const { messages } = useWebSocket();
  const token = Cookies.get("access_token");
  const { HOST_URL } = config;

  const fetchOnlineFriends = async () => {
    try {
      const response = await axios.get<[OnlineFriends]>(
        `${HOST_URL}/api/chat/api/users/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const onlineUsersList = response.data;
      setOnlineFriends(
        onlineUsersList.map((user: OnlineFriends, index: number) => ({
          id: index.toString(),
          username: user.username,
          profile_image: user.profile_image.replace("http://","https://"),
        }))
      );
    } catch (error) {
      console.error("Error fetching online friends:", error);
    }
  };
  
  useEffect(() => {
    fetchOnlineFriends();
  }, [messages, token]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const response = await axios.get<ChatData[]>(
          `${HOST_URL}/api/chat/last-message/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const lastMessages = response.data;
        
        setFriends(
          lastMessages.map((user: ChatData, index: number) => ({
            id: index.toString(),
            name: user.user2.username,
            avatar: user.user2.profile_image.replace("http://", "https://"),
            content:
              user.last_message.content.length > 10
                ? user.last_message.content.substring(0, 10) + "..."
                : user.last_message.content,
            timestamp: user.timestamp,
          }))
        );
      } catch (error) {
        console.error("Error fetching last messages:", error);
      }
    };
    fetchLastMessages()
    if (messages.length > 0) {
      fetchLastMessages();
    }
  }, [token, messages]);


  const handleClick = (friendName: string) => {
    onClick(friendName);
  };

  return (
    <div className="flex flex-col w-[350px] bg-[#3A0CA3] text-white p-4 rounded-r-[44px]">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <button className="p-2" aria-label="Compose new message">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl mb-4">Friends</h2>
        <div className="flex overflow-x-auto pb-4 gap-4">
          {onlineFriends.map((friend) => (
            <button 
              key={friend.id} 
              className="flex flex-col  items-center justify-center flex-shrink-0 w-[61px] h-[86px] bg-[#5012C4] rounded-lg"
            >
              <div
                className="relative"
                onClick={() => handleClick(friend.username)}
              >
                <img
                  src={friend.profile_image.replace("http://","https://")}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <span className="text-sm mt-1">{friend.username}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="w-full bg-white rounded-full pl-10 pr-4 py-2 text-black"
          placeholder="Search for something..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className="flex-1 overflow-hidden">
        <div className="space-y-4">
          {friends
            .filter((friend) =>
              friend.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((friend) => (
              <button
                key={friend.id}
                className="flex items-center gap-3 p-2 hover:bg-purple-900 rounded-lg transition-colors w-full"
              >
                <img
                  src={friend.avatar.replace("http://","https://")}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full bg-purple-700"
                />
                <div
                  className="flex-1 text-left"
                  onClick={() => handleClick(friend.name)}
                >
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className="text-sm text-gray-300 truncate">
                    {friend.content}
                  </p>
                </div>
                {/* <span className="text-sm text-gray-300">{friend.timestamp}</span> */}
              </button>
            ))}
        </div>
      </section>
    </div>
  );
};

export default FriendsList;
