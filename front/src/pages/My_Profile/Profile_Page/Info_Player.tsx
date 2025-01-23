import "./Info_Player.css";
import { LinearProgress } from "@mui/material";
import etoile from "/public/Etoile.svg";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import { usePlayer } from "../PlayerContext";

export const Info_Player = () => {
  const my_user = usePlayer();

  const percentage = (total: number | undefined, win: number | undefined) => {
    if (total === undefined || win === undefined || total === 0) return 0;
    const result = (win / total) * 100;
    return result;
  };

  const percentage_lose = (
    total: number | undefined,
    lose: number | undefined
  ) => {
    if (total === undefined || lose === undefined || total === 0) return 0;
    const result = (lose / total) * 100;
    return result;
  };

  const percentage_acheiv = (lose: number | undefined) => {
    if (lose == undefined) return 0;
    const result = (lose / 17) * 100;
    return result;
  };

  const percentage_exp = () => {
    const result = (50 / 100) * 100;
    return result;
  };

  const check_rank = (points: number | undefined): string | undefined => {
    if (points === undefined) return "CHEAT";
    else if (points < 100) return "IRON";
    else if (points > 100 && points < 200) return "BRONZE";
    else if (points > 200 && points < 300) return "SILVER";
    else if (points > 300 && points < 500) return "GOLD";
    else if (points > 500 && points < 700) return "PLATIUM";
    else if (points > 700 && points < 1200) return "MASTER";
    else return "CHALLENGER";
  };

  const check_next_rank = (points: number | undefined): string => {
    if (points === undefined) return "";
    else if (points < 100) return "BRONZE";
    else if (points > 100 && points < 200) return "SILVER";
    else if (points > 200 && points < 300) return "GOLD";
    else if (points > 300 && points < 500) return "PLATIUM";
    else if (points > 500 && points < 700) return "MASTER";
    else if (points > 700 && points < 1200) return "CHALLENGER";
    else return "IN_MAX";
  };

  const data_player = usePlayer();

  return (
    <div className="details_of_the_profile">
      <div className="Photo_and_state">
        <div className="Photo_of_the_profile">
          <img
            src={data_player.playerData?.profile_image}
            className="Photo_P2"
          />
        </div>
        <div className="States_Profile1">
          <div className="Win_and_Achievem">
            <div className="Win_State hover-container1">
              <CircularProgress
                capIsRound
                value={percentage(
                  my_user.playerData?.total_games,
                  my_user.playerData?.win_games
                )}
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
                  {percentage(
                    my_user.playerData?.total_games,
                    my_user.playerData?.win_games
                  )}
                  %
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Win Rate</span>
            </div>
            <div className="Acheivement_State hover-container1">
              <CircularProgress
                capIsRound
                value={percentage_acheiv(my_user.playerData?.lose_games)}
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
                  {percentage_acheiv(my_user.playerData?.lose_games)}%
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Acheievment Rate</span>
            </div>
          </div>
          <div className="Exp_and_Lose">
            <div className="Lose_State hover-container">
              <CircularProgress
                capIsRound
                value={percentage_lose(
                  my_user.playerData?.total_games,
                  my_user.playerData?.lose_games
                )}
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
                  {percentage_lose(
                    my_user.playerData?.total_games,
                    my_user.playerData?.lose_games
                  )}
                  %
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Lose Rate</span>
            </div>
            <div className="Exp_State hover-container">
              <CircularProgress
                capIsRound
                value={percentage_exp()}
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
                  50/100 <br /> EXP
                </CircularProgressLabel>
              </CircularProgress>
              <span className="hover-text">Exp Rate</span>
            </div>
          </div>
        </div>
      </div>
      <div className="Info_Player">
        <div className="The_level">
          <div className="the_name_profile">
            {data_player.playerData?.username}
          </div>
          <div className="level_Profile">
            <div className="Progress_bar_lvl">
              <LinearProgress
                variant="determinate"
                value={percentage_exp()}
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
                {my_user.playerData?.level}
                <span className="hover-text">
                  Level {my_user.playerData?.level}
                </span>
              </div>
            </div>
          </div>
          <div className="Exp_Level">50 OF 100</div>
        </div>
        <div className="Static_Game">
          <ul>
            <li className="Static_Text">
              <span className="Color_Yellow">GAMES WON:</span>{" "}
              {my_user.playerData?.win_games} OF{" "}
              {my_user.playerData?.total_games}
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">WIN PERCENTAGE:</span>{" "}
              {percentage(
                my_user.playerData?.total_games,
                my_user.playerData?.win_games
              )}
              %
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">RANK:</span>{" "}
              {check_rank(my_user.playerData?.points)}
            </li>
            <li className="Static_Text">
              <span className="Color_Yellow">NEXT RANK:</span>{" "}
              {check_next_rank(my_user.playerData?.points)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Info_Player;
