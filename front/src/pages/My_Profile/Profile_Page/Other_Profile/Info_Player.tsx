// import ph_pro from "../../Images/profile.png";
import other from "./Info_Player.module.css";
import { LinearProgress } from "@mui/material";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { config } from "../../../../config";

export const Info_Player = ({ username }: { username: string | undefined }) => {
  interface data_of_player {
    username: string;
    level: number;
    total_games: number;
    win_games: number;
    lose_games: number;
    points: number;
    profile_image: string;
    cover_image: string;
  }

  const token = Cookies.get("access_token");

  const [data, Setdata] = useState<data_of_player | null>(null);
 const { HOST_URL } = config;
  useEffect(() => {
    const get_data = async () => {
      try {
        const response = await fetch(
          `${HOST_URL}/api/user_auth/get-player/${username}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const info = await response.json();
        Setdata(info);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    get_data();
  }, [username]);

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
    <div className={other.details_of_the_profile}>
      <div className={other.Photo_and_state}>
        <div className={other.Photo_of_the_profile}>
          <img src={data?.profile_image} className={other.Photo_P2} />
        </div>
        <div className={other.States_Profile1}>
          <div className={other.Win_and_Achievem}>
            <div className={`${other.Win_State} ${other.hover_container1}`}>
              <CircularProgress
                capIsRound
                value={percentage(data?.total_games, data?.win_games)}
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
                  {percentage(data?.total_games, data?.win_games)}%
                </CircularProgressLabel>
              </CircularProgress>
              <span className={other.hover_text1}>Win Rate</span>
            </div>
            <div
              className={`${other.Acheivement_State} ${other.hover_container1}`}
            >
              <CircularProgress
                capIsRound
                value={percentage_acheiv(data?.lose_games)}
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
                  {percentage_acheiv(data?.lose_games)}%
                </CircularProgressLabel>
              </CircularProgress>
              <span className={other.hover_text1}>Acheievment Rate</span>
            </div>
          </div>
          <div className={other.Exp_and_Lose}>
            <div className={`${other.Lose_State} ${other.hover_container11}`}>
              <CircularProgress
                capIsRound
                value={percentage_lose(data?.total_games, data?.lose_games)}
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
                  {percentage_lose(data?.total_games, data?.lose_games)}%
                </CircularProgressLabel>
              </CircularProgress>
              <span className={other.hover_text11}>Lose Rate</span>
            </div>
            <div className={`${other.Exp_State} ${other.hover_container1}`}>
              <CircularProgress
                capIsRound
                value={percentage_exp(data?.points, data?.level)}
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
                {percentage_exp(data?.points, data?.level)}%
                </CircularProgressLabel>
              </CircularProgress>
              <span className={other.hover_text1}>Exp Rate</span>
            </div>
          </div>
        </div>
      </div>
      <div className={other.Info_Player}>
        <div className={other.The_level}>
          <div className={other.the_name_profile}>{data?.username}</div>
          <div className={other.level_Profile}>
            <div className={other.Progress_bar_lvl}>
              <LinearProgress
                variant="determinate"
                value={percentage_exp(data?.points, data?.level)}
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
              <img src="/Etoile.svg" className={other.Etoile_lvl} />
              <div className={`${other.lvl_value} ${other.hover_container1}`}>
                {data?.level}
                <span className={other.hover_text1}>Level {data?.level}</span>
              </div>
            </div>
          </div>
          <div className={other.Exp_Level}>{percentage_exp(data?.points, data?.level)}% OF EXP</div>
        </div>
        <div className={other.inside_ul}>
          <ul className={other.Static_Game}>
            <li className={other.title_of_player_stats}>Player stats</li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>GAMES WON:</span>{" "}
              {data?.win_games} OF {data?.total_games}
            </li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>WIN PERCENTAGE:</span>{" "}
              {percentage(data?.total_games, data?.win_games)}%
            </li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>RANK:</span>{" "}
              {check_rank(data?.points)}
            </li>
            <li className={other.Static_Text}>
              <span className={other.Color_Yellow}>NEXT RANK:</span>{" "}
              {check_next_rank(data?.points)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Info_Player;
