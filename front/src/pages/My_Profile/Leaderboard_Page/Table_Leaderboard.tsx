import leader from "./Table_Leaderboard.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import The_one from "../Images/Leader_1.svg";
import The_two from "../Images/Leader_2.svg";
import The_tree from "../Images/Leader_3.svg";
import { usePlayer } from "../PlayerContext";
import axios from "axios";
import Cookies from "js-cookie";


const Table_Leaderboard = () => {

  const token = Cookies.get("access_token")

  interface list_leaderboard_user {
    username: string;
    profile_image: string;
    points: number;
  }
  const navig = useNavigate();

  // const responce = axios.get("")

  const my_user = usePlayer();

  const myusername = my_user.playerData?.username;

  const [list_users, Setlist_users] = useState<list_leaderboard_user[]>([]);

  const if_me = (username: string) => {
    return username !== myusername
      ? leader.view_Profile
      : leader.view_Profile_none;
  };

  const rankImages = (key: number): JSX.Element | null => {
    switch (key) {
      case 1:
        return <img src={The_one} alt="Top1" className={leader.rank} />;
      case 2:
        return <img src={The_two} alt="Top2" className={leader.rank} />;
      case 3:
        return <img src={The_tree} alt="Top3" className={leader.rank} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/user_auth/leaderboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Setlist_users(response.data);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, [token]);

  const click_it = (username: string) => {
    navig(`/Profile/${username}`);
  };

  return (
    <div className={leader.content_ofTable}>
      <div className={leader.title_of_table}>
        <div className={leader.content_of_title0}>Rank</div>
        <div className={leader.content_of_title1}>Player</div>
        <div className={leader.content_of_title2}>Score</div>
        <div className={leader.content_of_title3}></div>
      </div>
      <div className={leader.the_table_leader}>
        {list_users.map((data, index) => (
          <div key={index} className={leader.columns}>
            <div className={leader.every_columns} key={index}>
              <div className={leader.index} key={index}>
                #{index + 1}
              </div>
              <div className={leader.imgclass}>
                <img
                  src={"http://127.0.0.1:8000" + data.profile_image}
                  alt="photo_Profile"
                  className={leader.class_img}
                />
                {rankImages(index + 1)}
              </div>
              <div className={leader.class_player}>{data.username}</div>
              <div className={leader.class_score}>{data.points} Points</div>
              <button onClick={() => click_it(data.username)}>
                <div className={if_me(data.username)}>View Profile</div>
              </button>
            </div>
            {index !== list_users.length - 1 ? (
              <hr className={leader.rule} />
            ) : (
              <hr className={leader.rule1} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table_Leaderboard;
