import React from 'react'
import "./Info-Profile.css"
import ph_pro from "../../Images/profile.png"
import etoile from "../../Images/Etoile.svg"

const Info_Profile = () => {
  return (
    <>
      <div className="part11">
        <div className="Score_style font-text">Your Score</div>
        <div className="Score_style_value">850 Points</div>
        <div className="Photo_dProfile">
          <img src={ph_pro} className="Photo_dProfile" />
        </div>
        <div className="Name_of_Profile">KACIMO</div>
        <div className="The_level">
          <div className="level_Profile">
              <img src={etoile} className="Etoile_lvl" />
              <div className="lvl_value">3</div>
          </div>
          <div className="Exp_Level">125 OF 365</div>
        </div>
      </div>
      <div className="part22">
        <div className="title_static">
          Game Statistics <hr />
        </div>
        <div className="Static_Game">
          <ul>
            <li className="Static_Text">
              <span className="Color_Yellow">GAMES WON:</span> 6 OF 8
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">WIN PERCENTAGE:</span> 80%
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">RANK:</span> BRONZE
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">WIN STREAK:</span> 4
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Info_Profile