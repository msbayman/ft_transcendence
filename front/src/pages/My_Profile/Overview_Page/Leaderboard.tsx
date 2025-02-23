import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import lead from "./Leaderboard.module.css";
// import { usePlayer } from "../PlayerContext";
import axios from "axios";
import { config } from "../../../config";
import Cookies from "js-cookie";

const Leaderboard = () => {
  interface data_Player {
    id: string;
    username: string;
    profile_image: string;
    points: number;
  }
  const navigate = useNavigate();
 const { HOST_URL } = config;
  const onclick = () => {
    navigate("/Leaderboard");
  };
  const token = Cookies.get("access_token");
  const [listPlayers, setListPlayers] = useState<data_Player[]>([]);

  useEffect(() => {
    axios
      .get(`${HOST_URL}/api/user_auth/leaderboard`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
      )
      .then((response) => {
        setListPlayers(response.data);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, [token]);

  const the_list = useMemo(() => {
    return listPlayers.slice(0, 10);
  }, [listPlayers]);

  return (
    <div className={lead.All_Content_Leaderboard}>
      <div className={lead.Title_Leaderboard}>
        <div className={lead.The_Title_Leaderboard}>Leaderboard</div>
        <button className={lead.Button_More} onClick={onclick}>
          More
        </button>
      </div>
      <div className={lead.Table_Leaderboard}>
        <div className={lead.Title_Table_Leaderboard}>
          <div className={`${lead.the_Name} ${lead.Rank}`}>Rank</div>
          <div className={`${lead.the_Name} ${lead.UserName}`}> UserName</div>
          <div className={`${lead.the_Name} ${lead.Top10}`}>Top 10</div>
          <div className={`${lead.the_Name} ${lead.Score}`}>Score</div>
        </div>
        <div className={lead.Inside_Leaderboard}>
          {the_list.map((data, index) => (
            <div key={index} className={lead.every_columns1}>
              <div className={lead.index}>#{index + 1}</div>
              {/* <div> */}
                <img
                  src={data.profile_image.replace("http://", "https://")}
                  alt="photo_Profile"
                  className={lead.photo_Profile}
                />
              {/* </div> */}
              <div className={lead.the_name}>{data.username}</div>
              <div className={lead.points}>{data.points} Points</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
