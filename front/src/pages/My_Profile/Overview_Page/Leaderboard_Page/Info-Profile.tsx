import React from "react";
import "./Info-Profile.css";
import Ph_pro from "../../Images/profile.png";
import etoile from "../../Images/Etoile.svg";
import { LinearProgress, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';

// const CustomLinearProgress = styled(LinearProgress)(() => ({
//   height: 12,
//   borderRadius: 12,
//   backgroundColor: '#ffffff', // Track color
//   '& .MuiLinearProgress-bar': {
//     backgroundColor: '#4caf50', // Progress bar color
//   },
//   value:32,
// }));

const Info_Profile = () => {
  return (
    <>
      <div className="part11">
        <div className="Score_style font-text">Your Score</div>
        <div className="Score_style_value">850 Points</div>
        <div className="Photo_dProfile">
          <img src={Ph_pro} className="Photo_dProfile" />
        </div>
        <div className="Name_of_Profile">KACIMO</div>
        <div className="The_level">
          <div className="level_Profile">
            <div className="Progress_bar_lvl">
              <LinearProgress variant="determinate" value={70} sx={{
                height: "12px",
                borderRadius: "30px",
                backgroundColor : 'whitesmoke',
                '& .MuiLinearProgress-bar': {
                backgroundColor: "green",
              },
              }}/>
            </div>
            <div className='lvl_progress'>
              <img src={etoile} className="Etoile_lvl" />
              <div className="lvl_value">13</div>
            </div>
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
};

export default Info_Profile;
