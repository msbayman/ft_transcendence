import "./State_of_Profile.css";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import { usePlayer } from "../PlayerContext";

const State_of_Profile = () => {
  const player = usePlayer();

  const achievements = [
    player.playerData?.win_1_game,
    player.playerData?.win_3_games,
    player.playerData?.win_10_games,
    player.playerData?.win_30_games,
    player.playerData?.reach_level_5,
    player.playerData?.reach_level_15,
    player.playerData?.reach_level_30,
    player.playerData?.perfect_win_game,
    player.playerData?.perfect_win_tournaments,
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

  return (
    <div className="all_content_state">
      <div className="part_1_state">
        <div className="Photo_Profile">
          <img
            src={player.playerData?.profile_image.replace(
              "http://",
              "https://"
            )}
            className="image Photo_P"
          />
          <img
            src="/Icones/border_profile.png"
            className="image Photo_border"
          />
        </div>
        <div className="Name_and_Online-state">
          <div className="Name">{player.playerData?.username}</div>
          <div className="Online-state">
            <div className="state"></div>Online
          </div>
        </div>
      </div>
      <div className="part_2_state">
        <div className="win_state hover-container">
          <CircularProgress
            capIsRound
            value={percentage(
              player.playerData?.total_games,
              player.playerData?.win_games
            )}
            color="green"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              {percentage(
                player.playerData?.total_games,
                player.playerData?.win_games
              )}
              %
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Win Rate</span>
        </div>
        <div className="lose_state hover-container">
          <CircularProgress
            capIsRound
            value={percentage_lose(
              player.playerData?.total_games,
              player.playerData?.lose_games
            )}
            color="red"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              {percentage_lose(
                player.playerData?.total_games,
                player.playerData?.lose_games
              )}
              %
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Lose Rate</span>
        </div>
        <div className="achievement_state hover-container">
          <CircularProgress
            capIsRound
            value={percentage_acheiv(trueCount)}
            color="rebeccapurple"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              {percentage_acheiv(trueCount)}%
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Acheivement Rate</span>
        </div>
        <div className="exp_state hover-container">
          <CircularProgress
            capIsRound
            value={percentage_exp(
              player.playerData?.points,
              player.playerData?.level
            )}
            color="yellow"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              {percentage_exp(
                player.playerData?.points,
                player.playerData?.level
              )}
              %
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text text-center">
            Exp Rate <br /> to reach lvl {player.playerData?.level}
          </span>
        </div>
      </div>
    </div>
  );
};

export default State_of_Profile;
