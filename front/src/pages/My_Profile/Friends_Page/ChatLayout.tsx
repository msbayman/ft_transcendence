import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "./useWebSocket";

import Cookies from "js-cookie";
import axios from "axios";
import { usePlayer } from "../PlayerContext";
import { config } from "../../../config";
interface PlayerInfo {
  id: number;
  username: string;
  profile_image: string;
}

interface APIResponse {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: number;
  is_read: boolean;
  sender_profile_image: string;
}

interface Message {
  id: number;
  text: string;
  sent: boolean;
  profile_image: string;
  timestamp: number;
  sender: string;
  receiver: string;
}

interface UserName {
  value: string;
}

const ChatInterface: React.FC<UserName> = ({ value }) => {
  const loggedplayer = usePlayer();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDiv, setShowDiv] = useState(false);
  const { messages, sendMessage } = useWebSocket();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const token = Cookies.get("access_token");
  const profile_redirec = useNavigate();
    const { HOST_URL } = config;


  const toggleDiv = () => {
    setShowDiv((prevState) => !prevState);
  };
  
  const [isblock, setIsBlock] = useState(false);
  const block = async () => {
    try {
      if (!isblock) {
        await axios.post(
          `${HOST_URL}/api/chat/block_user/${value}/`,
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
          `${HOST_URL}/api/chat/unblock_user/${value}/`,
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
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (value === "") return;
    const fetchPlayerInfo = async () => {
      try {
        const response = await axios.get<PlayerInfo>(
          `${HOST_URL}/api/chat/get_user_info/${value}/`,
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
            profile_image: response.data.profile_image.replace(
              "http://",
              "https://"
            ),
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
        const conversationResponse = await axios.get(
          `${HOST_URL}/api/chat/getconversation/${value}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (conversationResponse.status === 200) {
          const initialMessages: Message[] = conversationResponse.data
            .map((msg: APIResponse) => ({
              id: msg.id,
              text: msg.content,
              sent: msg.sender !== loggedplayer.playerData?.username,
              profile_image: `${msg.sender_profile_image}`,
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
          `${HOST_URL}/api/chat/isblocked/${value}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsBlock(blockStatusResponse.data.is_blocked);
      } catch (error) {
        console.error("Error fetching block status:", error);
      }
    };

    fetchData();
    fetchBlockStatus();
  }, [value, token, loggedplayer.playerData?.username]);

  const go_to_profile = (username: string | undefined) => {
    profile_redirec(`/Profile/${username}`);
  };

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
                profile_image:
                  wsMessage.sender === value
                    ? playerInfo?.profile_image.replace("http://", "https://") || ""
                    : loggedplayer.playerData?.profile_image.replace(
                        "http://",
                        "https://"
                      ) || "",
                sent: wsMessage.sender !== loggedplayer.playerData?.username,
              });
            }
          }
        });
        return newMessages.sort((a, b) => a.id - b.id);
      });
    }
  }, [messages, value, loggedplayer.playerData?.username, playerInfo?.profile_image, loggedplayer.playerData?.profile_image]);

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
      message: input,
    };
    sendMessage(message);
    setInput("");
  };


  if (value === "") {
    return (
      <div className="flex justify-center items-center gap-[60px] text-white w-11/12 rounded-l-[44px] flex-col bg-[#5012C4] p-4 font-alexandria">
        <span className="font-semibold text-5xl	text-white">
          Welcome to Transcendance Chat ..
        </span>
        <img src="/empty_chat.png" alt="chat_image" className="w-[700px]" />
        <span className="font-medium text-xl tracking-wider">
          Start Texting..
        </span>
      </div>
    );
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
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </div>
          </div>
          <hr className="max-w-lg mt-1.5" />
          <div className="mt-5 grid justify-center text-center gap-2">
            <img
              src={playerInfo?.profile_image.replace("http://", "https://")}
              className="rounded-full w-20 h-20"
              alt=""
            />
            <div>
              <h1 className="text-2xl">{playerInfo?.username}</h1>
            </div>
            <button
              onClick={() => go_to_profile(playerInfo?.username)}
              className="mt-5 flex flex-col items-center justify-center text-white rounded hover:bg-[#8f6edd]"
            >
              <img
                src="/Chat/viewprofile.svg"
                alt="View Profile"
                className="w-8 h-8"
              />
              <p>View Profile</p>
            </button>
          </div>
          <hr className="max-w-lg mt-1.5" />
          <div className="flex justify-between align-middle m-5">
            <button  onClick={() => sendChallenge(playerInfo?.username || "")} className="w-[100px] flex flex-col items-center justify-center gap-1 rounded hover:bg-[#8f6edd]">
              <img className="" src="/Chat/challenge.svg" alt="" />
              <p>chalenge</p>
            </button>
            <button
              onClick={block}
              className="w-[100px] flex flex-col items-center justify-center gap-1 rounded hover:bg-[#8f6edd]"
            >
              <img src="/Chat/block.svg" alt="" />
              <p> {isblock ? "ubblock user" : "block user"}</p>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 rounded-l-[44px] flex flex-col bg-[#5012C4] p-4">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="h-14 w-14">
            <img
              src={playerInfo?.profile_image.replace("http://", "https://")}
              alt="Profile"
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{value}</h1>
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
              className={`flex items-start gap-3 max-w-full break-words whitespace-normal p-2 ${
                message.sent ? "" : "justify-end"
              }`}
            >
              {message.sent && (
                <div className="h-10 w-10">
                  <img
                    src={message.profile_image}
                    alt="Profile"
                    className="rounded-full"
                  />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.sent
                    ? "bg-white text-black"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="whitespace-normal max-w-screen-lg">
                  {message.text}
                </p>
              </div>
              {!message.sent && (
                <div className="h-10 w-10">
                  <img
                    src={message.profile_image}
                    alt="Profile"
                    className="rounded-full"
                  />
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
