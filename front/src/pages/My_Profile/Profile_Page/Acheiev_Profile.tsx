import acheiv from "./Acheiev_Profile.module.css";
import win1 from "../../../assets/Achievements/win_1_game.png"
import win3 from "../../../assets/Achievements/win_3_game.png"
import win10 from "../../../assets/Achievements/win_10_game.png"
import win20 from "../../../assets/Achievements/win_20_game.png"
import reach5 from "../../../assets/Achievements/reach_level_5.png"
import reach15 from "../../../assets/Achievements/reach_level_15.png"
import reach30 from "../../../assets/Achievements/reach_level_30.png"
import perfect_game from "../../../assets/Achievements/perfect_win_game.png"
import perfect_tournament from "../../../assets/Achievements/perfect_win_tournament.png"
import { usePlayer } from "../PlayerContext";

const Acheiev_Profile = () => {
  
  const if_true = (status: boolean|undefined) => {
    return status === true ? acheiv.true : acheiv.false;
  };
  const my_data = usePlayer();
  
  const total = [
    {
      id: 1,
      title_achievement: "Win 1 Game",
      status: my_data.playerData?.win_1_game,
      path_image: win1,
    },
    {
      id: 2,
      title_achievement: "Win 3 Games",
      status: my_data.playerData?.win_3_games,
      path_image: win3,
    },
    {
      id: 3,
      title_achievement: "Win 10 Games",
      status: my_data.playerData?.win_10_games,
      path_image: win10,
    },
    {
      id: 4,
      title_achievement: "Win 30 Games",
      status: my_data.playerData?.win_30_games,
      path_image: win20,
    },
    {
      id: 5,
      title_achievement: "Reach Level 5",
      status: my_data.playerData?.reach_level_5,
      path_image: reach5,
    },
    {
      id: 6,
      title_achievement: "Reach Level 15",
      status: my_data.playerData?.reach_level_15,
      path_image: reach15,
    },
    {
      id: 7,
      title_achievement: "Reach Level 30",
      status: my_data.playerData?.reach_level_30,
      path_image: reach30,
    },
    {
      id: 8,
      title_achievement: "Perfect Win in Normal Game",
      status: my_data.playerData?.perfect_win_game,
      path_image: perfect_game,
    },
    {
      id: 9,
      title_achievement: "Perfect Win in Tournament",
      status: my_data.playerData?.perfect_win_tournaments,
      path_image: perfect_tournament,
    },
  ];

  const value_true = total.filter((if_truee) => if_truee.status === true)

  return (
    <div className={acheiv.all_Ache}>
      <div className={acheiv.Title_Ach}>
        <div className={acheiv.T1_Ach}>ACHEIVEMENTS</div>
        <div className={acheiv.T2_Ach}>( {value_true.length} / 9 )</div>
      </div>
      <div className={acheiv.Content_Ach}>
        <div className={acheiv.inside_content_ach}>
          {total.map((tot_ach, index) => (
            <div key={index} className={`${acheiv.inside_ache} ${acheiv.hover_container2}`}>
              <img
                className={if_true(tot_ach.status)}
                src={tot_ach.path_image}
              />
              <span className={acheiv.hover_text1}>{tot_ach.title_achievement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Acheiev_Profile;
