import acheiv from "./Acheiev_Profile.module.css";
import { usePlayer } from "../PlayerContext";

const Acheiev_Profile = () => {
  const if_true = (status: boolean | undefined) => {
    return status === true ? acheiv.true : acheiv.false;
  };
  const my_data = usePlayer();

  const total = [
    {
      id: 1,
      title_achievement: "Win 1 Game",
      status: my_data.playerData?.win_1_game,
      path_image: "/Achievements/win_1_game.png",
    },
    {
      id: 2,
      title_achievement: "Win 3 Games",
      status: my_data.playerData?.win_3_games,
      path_image: "/Achievements/win_3_game.png",
    },
    {
      id: 3,
      title_achievement: "Win 10 Games",
      status: my_data.playerData?.win_10_games,
      path_image: "/Achievements/win_10_game.png",
    },
    {
      id: 4,
      title_achievement: "Win 30 Games",
      status: my_data.playerData?.win_30_games,
      path_image: "/Achievements/win_20_game.png",
    },
    {
      id: 5,
      title_achievement: "Reach Level 5",
      status: my_data.playerData?.reach_level_5,
      path_image: "/Achievements/reach_level_5.png",
    },
    {
      id: 6,
      title_achievement: "Reach Level 15",
      status: my_data.playerData?.reach_level_15,
      path_image: "/Achievements/reach_level_15.png",
    },
    {
      id: 7,
      title_achievement: "Reach Level 30",
      status: my_data.playerData?.reach_level_30,
      path_image: "/Achievements/reach_level_30.png",
    },
    {
      id: 8,
      title_achievement: "Perfect Win in Normal Game",
      status: my_data.playerData?.perfect_win_game,
      path_image: "/Achievements/perfect_win_game.png",
    },
    {
      id: 9,
      title_achievement: "Perfect Win in Tournament",
      status: my_data.playerData?.perfect_win_tournaments,
      path_image: "/Achievements/perfect_win_tournament.png",
    },
  ];

  const value_true = total.filter((if_truee) => if_truee.status === true);

  return (
    <div className={acheiv.all_Ache}>
      <div className={acheiv.Title_Ach}>
        <div className={acheiv.T1_Ach}>ACHEIVEMENTS</div>
        <div className={acheiv.T2_Ach}>( {value_true.length} / 9 )</div>
      </div>
      <div className={acheiv.Content_Ach}>
        <div className={acheiv.inside_content_ach}>
          {total.map((tot_ach, index) => (
            <div
              key={index}
              className={`${acheiv.inside_ache} ${acheiv.hover_container2}`}
            >
              <img
                className={if_true(tot_ach.status)}
                src={tot_ach.path_image}
              />
              <span className={acheiv.hover_text1}>
                {tot_ach.title_achievement}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Acheiev_Profile;
