import React from "react";
import { useNavigate } from "react-router-dom";
import Button_Play from "../Images/Button_Play.svg";
import "./Profile_Page.css";
import Info_Player from "./Info_Player";
import Acheiev_Profile from "./Acheiev_Profile";
import States_Profile from "./States_Profile";
import Recent_Game from "./Recent_Game";
import To_settings from "../Images/Into_settings.svg";

export const Profile_Page = () => {
  const navigate = useNavigate();

  const Onclick = () => {
    navigate("/Play");
  };

  const click_to_settings = () => {
    navigate("/Settings");
  };

  return (
    <div className="Profile_Page_all">
      <div className="all_content_Profile">
        <div className="cover_profile">
          <div className="button_settings">
            <button onClick={click_to_settings}>
              <img src={To_settings} />
            </button>
          </div>
        </div>
        <div className="content_profile">
          <div className="details_of_profile">
            <Info_Player />
            <div className="Play_Button">
              <button onClick={Onclick} className="play">
                <img src={Button_Play} />
              </button>
            </div>
          </div>
          <div className="Recent_Game">
            <Recent_Game />
          </div>
          <div className="Acheivement_and_States">
            <div className="Content_of_Acheievment">
              <Acheiev_Profile />
            </div>
            <div className="Content_of_States">
              <States_Profile />
            </div>
          </div>

          <div className="play_hide"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile_Page;
