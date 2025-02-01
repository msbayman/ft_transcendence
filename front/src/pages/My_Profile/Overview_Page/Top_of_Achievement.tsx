import "./Top_of_Achievement.css";
import { usePlayer } from "../PlayerContext";

const Top_of_Achievement = () => {

  const my_data = usePlayer();

  const total = [
    {
      id: 1,
      title_achievement: "Perfect Win in Tournament",
      status: my_data.playerData?.perfect_win_tournaments,
      path_image: "/Achievements/perfect_win_tournament.png",
    },
    {
      id: 2,
      title_achievement: "Perfect Win in Normal Game",
      status: my_data.playerData?.perfect_win_game,
      path_image: "/Achievements/perfect_win_game.png",
    },
    {
      id: 3,
      title_achievement: "Reach Level 30",
      status: my_data.playerData?.reach_level_30,
      path_image: "/Achievements/reach_level_30.png",
    },
    {
      id: 4,
      title_achievement: "Reach Level 15",
      status: my_data.playerData?.reach_level_15,
      path_image: "/Achievements/reach_level_15.png",
    },
    {
      id: 5,
      title_achievement: "Win 30 Games",
      status: my_data.playerData?.win_30_games,
      path_image: "/Achievements/win_20_game.png",
    },
    {
      id: 6,
      title_achievement: "Reach Level 5",
      status: my_data.playerData?.reach_level_5,
      path_image: "/Achievements/reach_level_5.png",
    },
    {
      id: 7,
      title_achievement: "Win 10 Games",
      status: my_data.playerData?.win_10_games,
      path_image: "/Achievements/win_10_game.png",
    },
    {
      id: 8,
      title_achievement: "Win 3 Games",
      status: my_data.playerData?.win_3_games,
      path_image: "/Achievements/win_3_game.png",
    },
    {
      id: 9,
      title_achievement: "Win 1 Game",
      status: my_data.playerData?.win_1_game,
      path_image: "/Achievements/win_1_game.png",
    },
  ];

  const true_achiev = total.filter( (achei) => achei.status === true ).slice(0, 3);

  return (
    <div className="all_content_acheiv">
      <div className="part_1_achv">
        {true_achiev.length > 0 ? (
          true_achiev.map((list, index) => (
            <div key={index} className="every_achiev">
              <div className="every_image_c">
                {" "}
                <img className="every_image" src={list.path_image} alt="" />
              </div>
              <span> {list.title_achievement}</span>
            </div>
          ))
        ) : (
          <div className="if_no">
            <img src="/Navbar/No.png" className="if_noo" alt="" />
            No Achievements !
          </div>
        )}
      </div>
      <div className="Achiev_Title">
        <img src="/back_acheiv.svg" className="part_2_achv" />
        <div className="Titre_Acheivement">
          Top
          <br />
          Achievement
        </div>
      </div>
    </div>
  );
};

export default Top_of_Achievement;
