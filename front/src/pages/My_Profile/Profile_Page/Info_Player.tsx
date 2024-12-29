import * as React from "react";
import ph_pro from "../Images/profile.png";
import './Info_Player.css';
import { LinearProgress } from "@mui/material";
import etoile from "../Images/Etoile.svg";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";

export const Info_Player = () => {
  return (
    <div className="details_of_the_profile">
      <div className="Photo_and_state">
        <div className="Photo_of_the_profile">
          <img src={ph_pro} className="Photo_P2" />
        </div>
        <div className="States_Profile1">
          <div className="Win_and_Achievem">
            <div className="Win_State hover-container1">
              <CircularProgress
                capIsRound
                value={60}
                color="green"
                size="100%"
                thickness={16}
                sx={{
                  "& .chakra-progress__indicator": {
                    strokeWidth: "8",
                  },
                }}
              >
                <CircularProgressLabel fontSize="calc(90px * 0.2)">
                  60%
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Win Rate</span>
            </div>
            <div className="Acheivement_State hover-container1">
              <CircularProgress
                capIsRound
                value={10}
                color="#e2862a"
                size="100%"
                thickness={13}
                sx={{
                  "& .chakra-progress__indicator": {
                    strokeWidth: "8",
                  },
                }}
              >
                <CircularProgressLabel fontSize="calc(90px * 0.2)">
                  10%
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Acheievment Rate</span>
            </div>
          </div>
          <div className="Exp_and_Lose">
            <div className="Lose_State hover-container">
              <CircularProgress
                capIsRound
                value={40}
                color="red"
                size="100%"
                thickness={16}
                sx={{
                  "& .chakra-progress__indicator": {
                    strokeWidth: "8",
                  },
                }}
              >
                <CircularProgressLabel fontSize="calc(90px * 0.2)">
                  40%
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Lose Rate</span>
            </div>
            <div className="Exp_State hover-container">
              <CircularProgress
                capIsRound
                value={80}
                color="#AE445A"
                size="100%"
                thickness={13}
                sx={{
                  "& .chakra-progress__indicator": {
                    strokeWidth: "6.5",
                  },
                }}
              >
                <CircularProgressLabel fontSize="calc(90px * 0.2)">
                  125/365 <br /> EXP
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Exp Rate</span>
            </div>
          </div>
        </div>
      </div>
      <div className="Info_Player">
        <div className="The_level">
          <div className="the_name_profile">Kacimo</div>
          <div className="level_Profile">
            <div className="Progress_bar_lvl">
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{
                  height: "12px",
                  borderRadius: "30px",
                  backgroundColor: "whitesmoke",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "green",
                  },
                }}
              />
            </div>
            <div className="lvl_progress">
              <img src={etoile} className="Etoile_lvl " />
              <div className="lvl_value hover-container">
                13
                <span className="hover-text">Level 13</span>
              </div>
            </div>
          </div>
          <div className="Exp_Level">125 OF 365</div>
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
    </div>
  );
};
export default Info_Player;
