import React, { useState, useEffect } from 'react';
import gojo from "../assets/gojo.png";

interface User {
  id: number;
  username: string;
  avatar?: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
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
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');

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

          // Convert users to friends
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
      senderId: friends.length > 0 ? friends[0].id : "1",
      senderName: friends.length > 0 ? friends[0].name : "Ilyass Asrarfi",
      avatar: gojo,
      content: "Salam bro hani wach n9assro",
      timestamp: "14:23",
      read: true
    },
    // You can similarly update other hardcoded messages with fetched user data
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
          {friends.length > 4 && (
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center">
                <span className="text-sm">+{friends.length - 4}</span>
              </div>
              <span className="text-sm mt-1">more...</span>
            </div>
          )}
        </div>
      </section>

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
}