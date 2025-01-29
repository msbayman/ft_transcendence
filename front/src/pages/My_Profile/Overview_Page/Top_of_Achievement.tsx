import win1 from "/Achievements/win_1_game.png";
import win3 from "/Achievements/win_3_game.png";
import win10 from "/Achievements/win_10_game.png";
import win20 from "/Achievements/win_20_game.png";
import reach5 from "/Achievements/reach_level_5.png";
import reach15 from "/Achievements/reach_level_15.png";
import reach30 from "/Achievements/reach_level_30.png";
import perfect_game from "/Achievements/perfect_win_game.png";
import perfect_tournament from "/Achievements/perfect_win_tournament.png";
import "./Top_of_Achievement.css";

const Top_of_Achievement = () => {
  const total = [
    {
      id: 1,
      title_achievement: "Perfect Win in Tournament",
      status: "false",
      path_image: perfect_tournament,
    },
    {
      id: 2,
      title_achievement: "Perfect Win in Normal Game",
      status: "false",
      path_image: perfect_game,
    },
    {
      id: 3,
      title_achievement: "Reach Level 30",
      status: "false",
      path_image: reach30,
    },
    {
      id: 4,
      title_achievement: "Reach Level 15",
      status: "false",
      path_image: reach15,
    },
    {
      id: 5,
      title_achievement: "Win 20 Games",
      status: "false",
      path_image: win20,
    },
    {
      id: 6,
      title_achievement: "Reach Level 5",
      status: "false",
      path_image: reach5,
    },
    {
      id: 7,
      title_achievement: "Win 10 Games",
      status: "false",
      path_image: win10,
    },
    {
      id: 8,
      title_achievement: "Win 3 Games",
      status: "false",
      path_image: win3,
    },
    {
      id: 9,
      title_achievement: "Win 1 Game",
      status: "false",
      path_image: win1,
    },
  ];

  const true_achiev = total
    .filter((achei) => achei.status === "true")
    .slice(0, 3);

  // const achiev_3 = true_achiev.slice(0, 3);

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
