import React, { useState, useEffect } from 'react';
import gojo from "../assets/gojo.png";

interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: number;
  receiver: number;
}

interface LastMessage {
  user1: string;
  user2: string;
  last_message: Message;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
}

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0ODg5MTUyLCJpYXQiOjE3MzQ2Mjk5NTIsImp0aSI6IjAwNWUzMzkyYzNhYjRlYjQ4NzFmZjBkMDZjNGZiN2I3IiwidXNlcl9pZCI6MTN9.JvIy7LzOWsDu_h4D5JpmrSNapBLTKR3UQ2q7YWQp7vw';
        
        console.log('Fetching messages...');
        const response = await fetch('http://127.0.0.1:8000/chat/last-message/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            console.log('No messages found');
            setFriends([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LastMessage[] = await response.json();
        console.log('Received data:', data);

        const convertedFriends: Friend[] = data.map((messageData, index) => ({
          id: index.toString(),
          name: messageData.user2,
          avatar: gojo,
          online: index < 4, // First 4 users shown as online
          lastMessage: messageData.last_message.content
        }));

        setFriends(convertedFriends);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchLastMessages();
  }, []);

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
          {friends.map((friend) => (
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
              {friend.lastMessage && (
                <span className="text-xs text-gray-300 truncate w-24 text-center">
                  {friend.lastMessage}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 p-2 hover:bg-purple-900 rounded-lg transition-colors"
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-12 h-12 rounded-full bg-purple-700"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{friend.name}</h3>
                <p className="text-sm text-gray-300 truncate">
                  {friend.lastMessage || 'No messages yet'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}