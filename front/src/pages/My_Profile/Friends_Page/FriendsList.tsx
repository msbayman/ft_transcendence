import React, { useState, useEffect } from 'react';
import gojo from "../assets/gojo.png";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface User {
  id: number;
  username: string;
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  unreadCount?: number;
}

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  // const friends: Friend[] = [
  //   { id: "1", name: "Asrarf", avatar: gojo, online: true },
  //   { id: "2", name: "Lwajdi", avatar: gojo, online: true },
  //   { id: "3", name: "ayman", avatar: gojo, online: true },
  //   { id: "4", name: "michel", avatar: gojo, online: true },
  //   { id: "5", name: "friend5", avatar: gojo, online: true },
  //   { id: "6", name: "friend6", avatar: gojo, online: false },
  //   { id: "7", name: "friend7", avatar: gojo, online: true },
  // ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/chat/api/users/', {
          headers: {
            'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NjM0NDcyLCJpYXQiOjE3MzQzNzUyNzIsImp0aSI6IjE4ODRhYTQ3MjlkZjQ2NWJiYTAyNDBmNTU3NzVjZTdhIiwidXNlcl9pZCI6MTN9.sPEv0q4AMl80_TW73rSBNp7m2QgDTtWi2NWsBwX6DcA',
          },
        });
        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);

          const convertedFriends: Friend[] = data.map((user, index) => ({
            id: user.id.toString(),
            name: user.username,
            avatar: gojo, // You might want to use user's actual avatar if available
            online: index < 4 // Arbitrarily mark first 4 users as online
          }));
          setFriends(convertedFriends);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
  }, []);
  

  const messages: Message[] = [
    {
      id: "1",
      senderId: "1",
      senderName: "Ilyass Asrarfi",
      avatar: gojo,
      content: "Salam bro hani wach n9assro",
      timestamp: "14:23",
      read: true
    },
    {
      id: "2",
      senderId: "2",
      senderName: "Alae lwajdi",
      avatar: gojo,
      content: "Salam bro hani wach n9assro",
      timestamp: "22:34",
      read: true
    },
    {
      id: "3",
      senderId: "3",
      senderName: "Ayman Msaoub",
      avatar: gojo,
      content: "wach wa nta douz ssayb inc",
      timestamp: "17:56",
      read: true
    },
    {
      id: "4",
      senderId: "4",
      senderName: "another one 1",
      avatar: gojo,
      content: "Salam bro hani wach n9assro",
      timestamp: "11:03",
      read: false,
      unreadCount: 2
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#4B0082] text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <button className="p-2" aria-label="Compose new message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl mb-4">Friends</h2>
        <div className="flex overflow-x-auto pb-4 gap-4">
          {friends.slice(0, 4).map((friend) => (
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
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center">
              <span className="text-sm">+3</span>
            </div>
            <span className="text-sm mt-1">more...</span>
          </div>
        </div>
      </section>

      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">All Chats</h2>
          <svg
            className="w-4 h-4 transform rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-320px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-center gap-3 p-2 hover:bg-purple-900 rounded-lg transition-colors"
              >
                <img
                  src={message.avatar}
                  alt={message.senderName}
                  className="w-12 h-12 rounded-full bg-purple-700"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{message.senderName}</h3>
                  <p className="text-sm text-gray-300 truncate">{message.content}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-gray-300">{message.timestamp}</span>
                  {message.unreadCount ? (
                    <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {message.unreadCount}
                    </span>
                  ) : (
                    message.read && (
                      <svg
                        className="w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

