"use client";

import gojo from "../assets/gojo.png";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./test.css";
import Cookies from "js-cookie";

interface APIResponse {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: number;
  is_read: boolean;
}

interface Message {
  id: number;
  text: string;
  sent: boolean;
  avatar: string;
  timestamp: number;
}

interface UserName {
  value: string;
}



const ChatInterface: React.FC<UserName> = ({ value }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const chatSocket = new WebSocket(
  //   "ws://" + window.location.host + "/ws/chat/" + value + "/"
  // );
  // console.log("url " + window.location.host)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch('http://127.0.0.1:8000/chat/getconversation/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Username': value,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log('No messages found');
            setMessages([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawJson = await response.json();
        
        // Convert API response to Message format and sort by ID
        const messages: Message[] = rawJson
          .map((msg: APIResponse) => ({
            id: msg.id, // Fixed: Use the correct id from APIResponse
            sent: msg.sender !== value,
            text: msg.content,
            avatar: gojo,
            timestamp: msg.timestamp,
          }))
          .sort((a: Message, b: Message) => a.id - b.id); // Sort messages by ID

        setMessages(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUsers();
  }, [value]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(), // Temporary ID until server response
        text: input,
        sent: true,
        avatar: gojo,
        timestamp: Date.now(),
      };

      // Update UI immediately
      setMessages(prevMessages => [...prevMessages, newMessage].sort((a, b) => a.id - b.id));
      // chatSocket.send(
      //   JSON.stringify({
      //     message: newMessage,
      //   })
      // );
      setInput("");

      // You can add the API call to send the message here
      // After successful API response, you might want to update the message with the correct ID from server
    }
  };

  return (
    <div className="main flex h-screen flex-col bg-[#560BAD] p-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="h-14 w-14">
          <img src={gojo} alt="Profile" className="rounded-full" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">{value}</h1>
          <p className="text-sm text-white/70">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sent ? "" : "justify-end"
            }`}
          >
            {message.sent && (
              <div className="h-10 w-10">
                <img src={message.avatar} alt="Profile" className="rounded-full" />
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                message.sent ? "bg-white text-black" : "bg-gray-200 text-black"
              }`}
            >
              <p>{message.text}</p>
            </div>
            {!message.sent && (
              <div className="h-10 w-10">
                <img src={message.avatar} alt="Profile" className="rounded-full" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-7">
        <div className="flex items-center gap-2 bg-white rounded-lg p-2">
          <input
            placeholder="Your Message..."
            className="flex-1 pl-10 border-0 ring-0 outline-none focus:ring-offset-0 px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          <button
            className="text-gray-500 p-2 rounded-full hover:bg-gray-200 transition"
            aria-label="Emoji"
          >
            <FontAwesomeIcon icon={faFaceSmile} className="h-5 w-5" />
          </button>

          <button
            className="p-2 bg-[#5D3FD3] text-white rounded-full hover:bg-[#4B32A6] transition"
            onClick={handleSend}
            aria-label="Send"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;