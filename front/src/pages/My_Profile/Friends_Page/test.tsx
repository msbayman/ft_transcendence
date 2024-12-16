"use client";

import gojo from "../assets/gojo.png";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./test.css";
interface Message {
  id: number;
  text: string;
  sent: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Lorem", sent: true },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consecte tur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam .",
      sent: false,
    },
    { id: 3, text: "Lorem ipsum dolor .", sent: true },
    { id: 4, text: "Lorem ipsum dolor sit amet, consecte .", sent: false },
    { id: 5, text: "Lorem", sent: true },
    {
      id: 6,
      text: "Lorem ipsum dolor sit amet, consecte tur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam .",
      sent: false,
    },
    { id: 7, text: "Lorem ipsum dolor .", sent: true },
  ]);

  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: input, sent: true },
      ]);
      setInput("");
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
          <h1 className="text-xl font-semibold text-white">Ilyass Asrarfi</h1>
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
                <img src={gojo} alt="Profile" className="rounded-full" />
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
                <img src={gojo} alt="Profile" className="rounded-full" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-7">
        <div className="flex items-center gap-2 bg-white rounded-lg p-2">
          {/* Attach Icon (Placeholder for Paperclip) */}
          {/* <button
            className="text-gray-500 p-2 rounded-full hover:bg-gray-200 transition"
            aria-label="Attach"
          >
            <div className="h-5 w-5" />
          </button> */}

          {/* Input */}
          <input
            placeholder="Your Message..."
            className="flex-1  pl-10 border-0 ring-0 outline-none  focus:ring-offset-0 px-2 "
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          {/* Emoji Button */}
          <button
            className="text-gray-500 p-2 rounded-full hover:bg-gray-200 transition"
            aria-label="Emoji"
          >
            <FontAwesomeIcon icon={faFaceSmile} className="h-5 w-5" />
          </button>

          {/* Send Button */}
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
}
