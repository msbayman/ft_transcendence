import "./Overview_page.css";
import State_of_Profile from "./State_of_Profile";
import Top_of_Achievement from "./Top_of_Achievement";
import The_Leaderboard from "./Leaderboard";
import Online_Friends_Overview from "./Online_Friends_Overview";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../PlayerContext";
import React from "react";
// import Cookies from "js-cookie";


export const Overview_Page: React.FC = () => {
  const navigate = useNavigate();
  const dataPlayer = usePlayer();

  const Onclick = () => {
    navigate("/Play");
  };
  return (
    <div className="Overview_Page">
      <div className="Part_1">
        <div className="part_welcome">
          <div className="Welcome_Back">Welcome Back !</div>
        </div>
        <div
          style={{
            backgroundImage: `url(${dataPlayer.playerData?.cover_image.replace("http://","https://")})`,
          }}
          className="Background_Profile"
        >
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
            <img src="/Button_Play.svg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview_Page;
