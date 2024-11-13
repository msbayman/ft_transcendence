// import React from "react";
import "./Overview_Page.css";
import State_of_Profile from "./State_of_Profile";
import Top_of_Achievement from "./Top_of_Achievement";

export const Overview_Page = () => {
  return (
    <div className="Overview_Page">
      <div className="Part_1">
        <div className="Background_Profile">
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
        <div className="Leaderboard"></div>
        <div className="Online_Friends"></div>
        <div className="Play_Button"></div>
      </div>
    </div>
  );
};

export default Overview_Page;
