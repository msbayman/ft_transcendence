import "./State_of_Profile.css";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/progress";
import {usePlayer} from "../PlayerContext"

const State_of_Profile = () => {
  const player = usePlayer();
  return (
    <div className="all_content_state">
      <div className="part_1_state">
        <div className="Photo_Profile">
          <div className="level_player"></div>
          <img src={player.playerData?.profile_image} className="Photo_P" />
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
            value={60}
            color="green"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              60%
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Win Rate</span>
        </div>
        <div className="lose_state hover-container">
          <CircularProgress
            capIsRound
            value={30}
            color="red"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              30%
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Lose Rate</span>
        </div>
        <div className="achievement_state hover-container">
          <CircularProgress
            capIsRound
            value={20}
            color="rebeccapurple"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(100px * 0.2)">
              20%
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Acheivement Rate</span>
        </div>
        <div className="exp_state hover-container">
          <CircularProgress
            capIsRound
            value={80}
            color="yellow"
            size="100%"
            sx={{
              "& .chakra-progress__indicator": {
                strokeWidth: "6",
              },
            }}
          >
            <CircularProgressLabel fontSize="calc(80px * 0.2)">
              120
              <br />
              /320
            </CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Exp Rate</span>
        </div>
      </div>
    </div>
  );
};

export default State_of_Profile;
