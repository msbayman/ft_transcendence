import React from "react";
import "./States_Profile.css";

export const States_Profile = () => {
  return (
    <div className="all_content_stat">
      <div className="Title_stat">STATES</div>
      <div className="Content_stat">
        <div className="the_table_stats">

        </div>
        <div className="info_table_stats">
          <span className="win_info"></span>
          <span className="text_win"> win</span>
          <span className="lose_info"></span>
          <span className="text_lose"> Lose</span>
        </div>
      </div>
    </div>
  );
};

export default States_Profile;
