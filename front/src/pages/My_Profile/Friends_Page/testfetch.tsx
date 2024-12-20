// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

interface Friend {
  id: string;
  sender: string;
  receiver: string;
  Conversation: string;
  timestamp: string;
}

const Component = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch('http://127.0.0.1:8000/chat/getconversation/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Username': 'admin',
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
  
        // Parse the response as JSON
        const rawJson = await response.json();
  
        // Log the raw JSON response
        console.log('Raw JSON Response:', rawJson);
  
        // Process the JSON to match your expected format
        const friends: Friend[] = rawJson.map((user: any, index: number) => ({
          id: index.toString(),
          sender: user.sender,
          receiver: user.receiver,
          Conversation: user.content,
          timestamp: user.timestamp,
        }));
  
        setFriends(friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchUsers();
  }, []);
  

  // Return UI or null if no UI is needed
  return null;
};

export default Component;
