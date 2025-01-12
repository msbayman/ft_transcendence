import React from "react";
import other from './Profile_Page.module.css';
import Info_Player from "./Info_Player";
import Acheiev_Profile from "./Acheiev_Profile";
import States_Profile from "./States_Profile";
import Recent_Game from "./Recent_Game";
import Action_Friends from "./Action_Friends";

export const Other_Profile_Page = (/*{ username }: { username: string }*/) => {
  return (
    <div className={other.Profile_Page_all}>
      <div className={other.all_content_Profile}>
        <div className={other.cover_profile}>
        </div>
        <div className={other.content_profile}>
          <div className={other.details_of_profile}>
            <Info_Player />
          </div>
          <div className={other.Recent_Game}>
            <Recent_Game />
          </div>
          <div className={other.Acheivement_and_States}>
            <div className={other.action_to_accept}>
              <Action_Friends /*username={username}*//>
            </div>
            <div className={other.Content_of_Acheievment}>
              <Acheiev_Profile />
            </div>
            <div className={other.Content_of_States}>
              <States_Profile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Other_Profile_Page;
