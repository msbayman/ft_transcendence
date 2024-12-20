import React, { useState, useEffect } from 'react';
import gojo from "../assets/gojo.png";
import Cookies from "js-cookie";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  content: string;
  timestamp: string;
}

interface SelectedUser {
  onClick: (newUser: string) => void;
}
//  fields = ['id', 'sender', 'receiver', 'Conversation', 'timestamp',]
const FriendsList: React.FC<SelectedUser> = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch('http://127.0.0.1:8000/chat/last-message/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log('No messages found');
            setFriends([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        const friends: Friend[] = users.map((user, index: number) => ({
          id: index.toString(),
          name: user.user2,
          avatar: user.avatar || gojo,
          online: index < 4, // Example logic for "online" status
          content: user.last_message.content,
          timestamp: user.timestamp,
        }));

        setFriends(friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleClick = (friendName: string) => {
    onClick(friendName);
  };

  return (
    <div className="flex flex-col h-screen bg-[#4B0082] text-white p-4">
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
          {friends.slice(0, 3).map((friend) => (
            <div key={friend.id} className="flex flex-col items-center flex-shrink-0">
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full bg-purple-700"
                />
                {friend.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#4B0082]" />
                )}
              </div>
              <span className="text-sm mt-1">{friend.name}</span>
            </div>
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
              <div
                key={friend.id}
                className="flex items-center gap-3 p-2 hover:bg-purple-900 rounded-lg transition-colors"
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full bg-purple-700"
                />
                <button
                  className="flex-1 text-left"
                  onClick={() => handleClick(friend.name)}
                >
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className="text-sm text-gray-300 truncate">{friend.content}</p>
                </button>
                <span className="text-sm text-gray-300">{friend.timestamp}</span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default FriendsList;
