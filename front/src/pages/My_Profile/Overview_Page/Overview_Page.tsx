import "./Overview_page.css"
import State_of_Profile from "./State_of_Profile";
import Top_of_Achievement from "./Top_of_Achievement";
import The_Leaderboard from "./Leaderboard"
import Online_Friends_Overview from "./Online_Friends_Overview";
import Button_Play from "/public/Button_Play.svg"
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../PlayerContext";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const Overview_Page: React.FC = () => {
const token = Cookies.get("access_token");
 useEffect(() => {
    const url = "ws://127.0.0.1:8000/ws/notifications/";
    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    }},[token]);

  


  const navigate = useNavigate();
  const dataPlayer = usePlayer();


  const Onclick = () => {
    navigate("/Play");
  } 
  return (
    <div className="Overview_Page">
      <div className="Part_1">
        <div className="part_welcome">
          <div className="Welcome_Back">Welcome Back !</div>
        </div>
        <div style={{ backgroundImage: `url(${dataPlayer.playerData?.cover_image})`}} className="Background_Profile" >
          <div className="States_Profile">
            <State_of_Profile />
          </div>
          <div className="Top_Achievement">
            <Top_of_Achievement />
          </div>
        </div>
      </div>
      <div className="Top_Achievement_mobile">
        <Top_of_Achievement />
      </div>
      <div className="Part_2">
        <div className="Leaderboard">
          <The_Leaderboard />
        </div>
        <div className="Online_Friends">
          <Online_Friends_Overview />
        </div>
        <div className="Play_Button">
          <button onClick={Onclick} className="play">
            <img src={Button_Play}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview_Page;
