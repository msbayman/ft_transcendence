// import React from "react";
import "./Info-Profile.css";
import { LinearProgress } from "@mui/material";
import { usePlayer } from "../PlayerContext";

const Info_Profile = () => {
  const my_user = usePlayer();

  const is_me = my_user.playerData;

  const percentage = (total: number | undefined, win: number | undefined) => {
    if (total === undefined || win === undefined || total === 0)
      return 0
    const result = (win / total) * 100;
    return result
  };

  const check_rank = (points:number | undefined) :string | undefined => {

    if(points === undefined)
      return "CHEAT"
    else if (points < 100)
      return "IRON"
    else if (points > 100 && points < 200)
      return "BRONZE"
    else if (points > 200 && points < 300)
      return "SILVER"
    else if (points > 300 && points < 500)
      return "GOLD"
    else if (points > 500 && points < 700)
      return "PLATIUM"
    else if (points > 700 && points < 1200)
      return "MASTER"
    else
      return "CHALLENGER"
  }

  const check_next_rank = (points:number | undefined) :string => {

    if(points === undefined)
      return ""
    else if (points < 100)
      return "BRONZE"
    else if (points > 100 && points < 200)
      return "SILVER"
    else if (points > 200 && points < 300)
      return "GOLD"
    else if (points > 300 && points < 500)
      return "PLATIUM"
    else if (points > 500 && points < 700)
      return "MASTER"
    else if (points > 700 && points < 1200)
      return "CHALLENGER"
    else
      return "IN_MAX"
  }

  return (
    <>
      <div className="part11">
        <div className="Score_style font-text">Your Score</div>
        <div className="Score_style_value">{is_me?.points} Points</div>
        <div className="Photo_dProfile">
          <img
            src={my_user.playerData?.profile_image.replace("http://", "https://")}
            className="Photo_dProfile"
          />
        </div>
        <div className="Name_of_Profile">{my_user.playerData?.username}</div>
        <div className="The_level">
          <div className="level_Profile">
            <div className="Progress_bar_lvl">
              <LinearProgress
                variant="determinate"
                value={5}
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
              <img src="/public/Etoile.svg" className="Etoile_lvl" />
              <div className="lvl_value">{is_me?.level}</div>
            </div>
          </div>
          <div className="Exp_Level">20 OF 365</div>
        </div>
      </div>
      <div className="part22">
        <div className="title_static">
          Game Statistics <hr />
        </div>
        <div className="Static_Game">
          <ul>
            <li className="Static_Text">
              <span className="Color_Yellow">GAMES WON:</span>{" "}
              {my_user.playerData?.win_games} OF {" "}
              {my_user.playerData?.total_games}
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">WIN PERCENTAGE:</span>{" "}
              {percentage(is_me?.total_games, is_me?.win_games)}
              %
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">RANK:</span> {check_rank(is_me?.points)}
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">NEXT RANK:</span> {check_next_rank(is_me?.points)}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Info_Profile;
