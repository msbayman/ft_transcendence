import "./Info_Player.css";
import { LinearProgress } from "@mui/material";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import { usePlayer } from "../PlayerContext";

export const Info_Player = () => {
  const my_user = usePlayer();

    const achievements = [
      my_user.playerData?.win_1_game,
      my_user.playerData?.win_3_games,
      my_user.playerData?.win_10_games,
      my_user.playerData?.win_30_games,
      my_user.playerData?.reach_level_5,
      my_user.playerData?.reach_level_15,
      my_user.playerData?.reach_level_30,
      my_user.playerData?.perfect_win_game,
      my_user.playerData?.perfect_win_tournaments,
    ];

    const trueCount = achievements.filter(
      (achievement) => achievement === true
    ).length;


  const percentage = (total: number | undefined, win: number | undefined) => {
    if (total === undefined || win === undefined || total === 0) return 0;
    const result = Number(((win / total) * 100).toFixed(0));
    return result;
  };

  const percentage_lose = (
    total: number | undefined,
    lose: number | undefined
  ) => {
    if (total === undefined || lose === undefined || total === 0) return 0;
    const result = Number(((lose / total) * 100).toFixed(0));
    return result;
  };

  const percentage_acheiv = (trueCount: number | undefined) => {
    if (trueCount == undefined) return 0;
    const result = Number(((trueCount / 9) * 100).toFixed(0));
    return result;
  };
  
  const percentage_exp = (
    points: number | undefined,
    level: number | undefined
  ) => {
    if (points == undefined || level == undefined || points == 0) return 0;
    const result = Number(((points / 1000 / level) * 100).toFixed(0));
    return result;
  };

  const check_rank = (points: number | undefined): string | undefined => {
    if (points === undefined) return "";
    else if (points < 1000) return "IRON";
    else if (points > 1000 && points < 2500) return "BRONZE";
    else if (points > 2500 && points < 5000) return "SILVER";
    else if (points > 5000 && points < 9000) return "GOLD";
    else if (points > 9000 && points < 13000) return "PLATIUM";
    else if (points > 13000 && points < 20000) return "MASTER";
    else return "CHALLENGER";
  };

  const check_next_rank = (points: number | undefined): string => {
    if (points === undefined) return "";
    else if (points < 1000) return "BRONZE";
    else if (points > 1000 && points < 2500) return "SILVER";
    else if (points > 2500 && points < 5000) return "GOLD";
    else if (points > 5000 && points < 9000) return "PLATIUM";
    else if (points > 9000 && points < 13000) return "MASTER";
    else if (points > 13000 && points < 20000) return "CHALLENGER";
    else return "IN_MAX";
  };

  return (
    <div className="details_of_the_profile">
      <div className="Photo_and_state">
        <div className="Photo_of_the_profile">
          <img
            src={my_user.playerData?.profile_image.replace(
              "http://",
              "https://"
            )}
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
                value={percentage_acheiv(trueCount)}
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
                  {percentage_acheiv(trueCount)}%
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
                value={percentage_exp(my_user.playerData?.points, my_user.playerData?.level)}
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
                  {percentage_exp(my_user.playerData?.points, my_user.playerData?.level)}{"%"}
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
            {my_user.playerData?.username}
          </div>
          <div className="level_Profile">
            <div className="Progress_bar_lvl">
              <LinearProgress
                variant="determinate"
                value={percentage_exp(my_user.playerData?.points, my_user.playerData?.level)}
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
              <img src="/Etoile.svg" className="Etoile_lvl " />
              <div className="lvl_value hover-container">
                {my_user.playerData?.level}
                <span className="hover-text">
                  Level {my_user.playerData?.level}
                </span>
              </div>
            </div>
          </div>
          <div className="Exp_Level">{percentage_exp(my_user.playerData?.points, my_user.playerData?.level)}% OF EXP</div>
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
