import React from "react"
import "./The_Leaderboard.css"
import Info_Profile from "./Info-Profile"
import Table_Leaderboard from "./Table_Leaderboard"

const The_Leaderboard = () => {
    return (
      <div className="Content_of_Leadearboard">
        <div className="title_leader">
          <span>Leaderboar</span>
          <button>d x</button>
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
    );
}

export default The_Leaderboard