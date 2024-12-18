// import React from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./Leaderboard.css";
import The_Leaderboard from "./The_Leaderboard";

const Leaderboard = () => {
  const navigate = useNavigate();

  const onclick = () => {
    navigate("/Overview/Leadearboard");
  }
  return (
    <div className="All_Content_Leaderboard">
      <div className="Title_Leaderboard">
        <div className="The_Title_Leaderboard">Leaderboard</div>
        {/* <div className="Button_More"> */}
          <button className="Button_More" onClick={onclick}>More</button>
          {/* </div> */}
      </div>
      <div className="Table_Leaderboard">
        <div className="Title_Table_Leaderboard">
          <div className="the_Name Rank">Rank</div>
          <div className="the_Name UserName"> UserName</div>
          <div className="the_Name Top10">Top 10</div>
          <div className="the_Name Score">Score</div>
        </div>
        <div className="Inside_Leaderboard">
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
          <p>sdfsdfdsfdsf</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
