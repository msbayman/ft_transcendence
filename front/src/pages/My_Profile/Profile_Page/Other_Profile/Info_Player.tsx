import * as React from "react";
import ph_pro from "../../Images/profile.png";
import other from './Info_Player.module.css';
import { LinearProgress } from "@mui/material";
import etoile from "../../Images/Etoile.svg";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";

export const Info_Player = () => {
  return (
    <div className={other.details_of_the_profile}>
      <div className={other.Photo_and_state}>
        <div className={other.Photo_of_the_profile}>
          <img src={ph_pro} className={other.Photo_P2} />
        </div>
        <div className={other.States_Profile1}>
          <div className={other.Win_and_Achievem}>
            <div className={`${other.Win_State} ${other.hover_container1}`}>
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
              <span className={other.hover_text1}>Win Rate</span>
            </div>
            <div className={`${other.Acheivement_State} ${other.hover_container1}`}>
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
              <span className={other.hover_text1}>Acheievment Rate</span>
            </div>
          </div>
          <div className={other.Exp_and_Lose}>
            <div className={`${other.Lose_State} ${other.hover_container11}`}>
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
              <span className={other.hover_text11}>Lose Rate</span>
            </div>
            <div className={`${other.Exp_State} ${other.hover_container1}`}>
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
              <span className={other.hover_text1}>Exp Rate</span>
            </div>
          </div>
        </div>
      </div>
      <div className={other.Info_Player}>
        <div className={other.The_level}>
          <div className={other.the_name_profile}>Kacimo</div>
          <div className={other.level_Profile}>
            <div className={other.Progress_bar_lvl}>
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
            <div className={other.lvl_progress}>
              <img src={etoile} className={other.Etoile_lvl} />
              <div className={`${other.lvl_value} ${other.hover_container1}`}>
                13
                <span className={other.hover_text1}>Level 13</span>
              </div>
            </div>
          </div>
          <div className={other.Exp_Level}>125 OF 365</div>
        </div>
        <div className={other.inside_ul}>
          <ul className={other.Static_Game}>
            <li className={other.title_of_player_stats}>Player stats</li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>GAMES WON:</span> 6 OF 8
            </li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>WIN PERCENTAGE:</span> 80%
            </li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>RANK:</span> BRONZE
            </li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>WIN STREAK:</span> 4
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Info_Player;
