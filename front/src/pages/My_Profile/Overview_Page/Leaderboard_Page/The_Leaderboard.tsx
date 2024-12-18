// import React from "react"
import "./The_Leaderboard.css"
import Info_Profile from "./Info-Profile"
import Table_Leaderboard from "./Table_Leaderboard"
import { useNavigate } from "react-router-dom"

const The_Leaderboard = () => {
  const navig = useNavigate();

  const Click_to_navigate = () => {
    navig("/Overview");
  }
    return (
      <div className="All_Content_of_Leadearboard">
        <div className="Content_of_Leadearboard">
          <div className="part_title_leader">
            <div className="title_leader">Leaderboard</div>
            <div className="click_button">
              <button onClick={Click_to_navigate}>X</button>
            </div>
          </div>
          <div className="content-leader">
            <div className="Info-Profile">
              <Info_Profile />
            </div>
            <div className="Table-Leader">
              <Table_Leaderboard />
            </div>
          </div>
        </div>
      </div>
    );
}

export default The_Leaderboard