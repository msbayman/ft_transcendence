import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useMemo } from "react";
import lead  from "./Leaderboard.module.css";
// import FakeTable from "./Fake_Table.json";
// import { useTable } from "react-table";
// import { usePlayer } from "../PlayerContext";
import axios from "axios";

const Leaderboard = () => {
  interface data_Player {
    id: string;
    username: string;
    profile_image: string;
    points: number;
  }
  const navigate = useNavigate();

  const onclick = () => {
    navigate("/Overview/Leadearboard");
  };

  const [listPlayers, setListPlayers] = useState<data_Player[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/user_auth/leaderboard")
      .then((response) => {setListPlayers(response.data)})
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

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
              <div>
                <img
                  src={'http://127.0.0.1:8000' + data.profile_image}
                  alt="photo_Profile"
                  className={lead.photo_Profile}
                />
              </div>
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
