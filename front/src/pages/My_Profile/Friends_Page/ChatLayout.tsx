import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "./WebSocketContext";
import Cookies from "js-cookie";
import axios from 'axios';
import blockIcon from "../../../assets/block.svg"
import viewprofile from "../../../assets/viewprofile.svg"
import challenge from "../../../assets/challenge.svg"
import { usePlayer } from "../PlayerContext";



interface PlayerInfo {
  id: number;
  username: string;
  profile_image: string;
  is_online: boolean;
}

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
  sender: string;
  receiver: string;
}

interface UserName {
  value: string;
}

const ChatInterface: React.FC<UserName> = ({ value }) => {
  const loggedplayer = usePlayer()
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDiv, setShowDiv] = useState(false);
  const { messages, sendMessage } = useWebSocket();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const token = Cookies.get("access_token");
  const profile_redirec = useNavigate();


  const toggleDiv = () => {
    setShowDiv((prevState) => !prevState);
  };
  
  const [isblock, setIsBlock] = useState(false);
  const block = async () => {
    try {
      if (!isblock) {
        await axios.post(
          `http://127.0.0.1:8000/chat/block_user/${value}`,
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsBlock(true);
      } else {
        await axios.post(
          `http://127.0.0.1:8000/chat/unblock_user/${value}`,
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsBlock(false);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    if (value === "") return;
  
    const fetchPlayerInfo = async () => {
      try {
        const response = await axios.get<PlayerInfo>(
          `http://127.0.0.1:8000/chat/get_user_info/${value}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setPlayerInfo({
            ...response.data,
            profile_image: response.data.profile_image, // Prepend base URL
            is_online: response.data.is_online
          });
        }
      } catch (error) {
        console.error("Error fetching player info:", error);
        setPlayerInfo(null);
      }
    };
    
    fetchPlayerInfo();
  }, [value, token]);


  useEffect(() => {
    if (value === "") return;
  
    const fetchData = async () => {
      try {
        // Fetch the conversation
        const conversationResponse = await axios.get(
          `http://127.0.0.1:8000/chat/getconversation/${value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (conversationResponse.status === 200) {
          const baseUrl = "http://127.0.0.1:8000";
          const initialMessages: Message[] = conversationResponse.data
            .map((msg: APIResponse) => ({
              id: msg.id,
              text: msg.content,
              sent: msg.sender !== loggedplayer.playerData?.username,
              avatar: `${baseUrl}${msg.sender_profile_image}`,
              timestamp: msg.timestamp,
              sender: msg.sender,
              receiver: msg.receiver,
            }))
            .sort((a: Message, b: Message) => a.id - b.id);
  
          setLocalMessages(initialMessages);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setLocalMessages([]);
      }
    };
    
    const fetchBlockStatus = async () => {
      try {
        const blockStatusResponse = await axios.get(
          `http://127.0.0.1:8000/chat/isblocked/${value}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsBlock(blockStatusResponse.data.is_blocked)
      } catch (error) {
        console.error("Error fetching block status:", error);
      }
    };
  
    fetchData();
    fetchBlockStatus();
  }, [value, token, loggedplayer.playerData?.username]);

  const go_to_profile = (username:string | undefined) => {
    profile_redirec(`/Profile/${username}`)
  }

  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        messages.forEach((wsMessage) => {
          if (wsMessage.sender === value || wsMessage.receiver === value) {
            const existingMessageIndex = newMessages.findIndex(
              (msg) => msg.id === wsMessage.id
            );
  
            if (existingMessageIndex === -1) {
              newMessages.push({
                ...wsMessage,
                avatar: wsMessage.sender === value ? playerInfo?.profile_image : loggedplayer.playerData?.profile_image,
                sent: wsMessage.sender !== loggedplayer.playerData?.username,
              });
            }
          }
        });
        return newMessages.sort((a, b) => a.id - b.id);
      });
    }
  }, [messages, value, loggedplayer.playerData?.username]);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [localMessages]);
  const sendChallenge = (name: string) => {
    if (loggedplayer.ws && loggedplayer.ws?.readyState === WebSocket.OPEN) {
      loggedplayer.ws.send(JSON.stringify({
        type: "send_challenge",
        sender: name
      }));
    }
  };

  const handleSend = () => {
    if (!input.trim() || !value) return;

    const message = {
      username: value,
      message: input
    };
    sendMessage(message);
    setInput("");
  };

  // const formatTimestamp = (timestamp: number) => {
  //   return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  if (value === "") {
    return <div className="flex justify-center items-center gap-[60px] text-white w-11/12 rounded-l-[44px] flex-col bg-[#5012C4] p-4 font-alexandria">
      <span className="font-semibold text-5xl	text-white">Welcome to Transcendance Chat ..</span>
      <img src="/public/empty_chat.png" alt="chat_image" className="w-[700px]" />
      <span className="font-medium text-xl tracking-wider">Start Texting..</span>
    </div>;
  }

  return (
    <div className="flex w-[1350px]">
      {showDiv && (
        <div className="rounded-l-[44px] w-1/4 bg-[#3A0CA3] h-full p-4 transition-all duration-300 ease-in-out text-white">
          <div className="flex justify-between text-3xl p-3 items-center">
            <div>Details</div>
            <div>
              <svg 
                className="w-[32px] h-[32px] text-gray-800 dark:text-white cursor-pointer" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                onClick={toggleDiv}
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </div>
          </div>
          <hr className="max-w-lg mt-1.5" />
          <div className="mt-5 grid justify-center text-center gap-2">
            <img src={playerInfo?.profile_image} className="rounded-full w-20 h-20" alt="" />
            <div>
              <h1 className="text-2xl">{playerInfo?.username}</h1>
              <h1 className="text-2xl text-lime-600">{playerInfo?.is_online ? "online" : "offline"}</h1>
            </div>
            <button onClick={() => go_to_profile(playerInfo?.username)} className="mt-5 flex flex-col items-center justify-center text-white rounded hover:bg-[#8f6edd]">
              <img src={viewprofile} alt="View Profile" className="w-8 h-8" />
              <p>View Profile</p>
            </button>
          </div>
          <hr className="max-w-lg mt-1.5" />
          <div className="flex justify-between align-middle m-5">
              <button onClick={() => sendChallenge(playerInfo?.username || "")} className="w-[100px] flex flex-col items-center justify-center gap-1 rounded hover:bg-[#8f6edd]">
                <img className="" src={challenge} alt="" />
                <p>chalenge</p>
              </button>
              <button onClick={block} className="w-[100px] flex flex-col items-center justify-center gap-1 rounded hover:bg-[#8f6edd]" >
                <img src={blockIcon} alt="" />
                <p> {isblock ? "ubblock user": "block user"}</p>
              </button>
          </div>
          {/* <button onClick={block}>
            <img src={icon} alt="" />
            {isblock ? "ubblock user": "block user"}
          </button> */}
          
        </div>
      )}

      <div className="flex-1 rounded-l-[44px] flex flex-col bg-[#5012C4] p-4">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="h-14 w-14">
            <img src={playerInfo?.profile_image} alt="Profile" className="rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{value}</h1>
            <p className="text-sm text-white/70">Online</p>
          </div>
          <button
            className="ml-auto p-2 rounded-full hover:bg-white/10 focus:outline-none"
            onClick={toggleDiv}
          >
            <svg
              className="w-12 h-12 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {localMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.sent ? "" : "justify-end"}`}
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
                <p className="whitespace-normal max-w-screen-lg">{message.text}</p>
                {/* <div className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(message.timestamp)}
                  {message.sent ? 
                    <span className="ml-2">Sent ✓</span> : 
                    <span className="ml-2">Received</span>
                  }
                </div> */}
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              className="p-2 bg-[#5D3FD3] text-white rounded-full h-[40px] w-[40px] hover:bg-[#4B32A6] transition flex items-center justify-center"
              onClick={handleSend}
              aria-label="Send"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;