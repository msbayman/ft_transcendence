import * as React from "react";
import { useNavigate } from "react-router-dom";
// import { useMemo } from "react";
import "./Leaderboard.css";
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

  const [listPlayers, setListPlayers] = React.useState<data_Player[]>([]);

  React.useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/user_auth/leaderboard")
      .then((response) => setListPlayers(response.data))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  const the_list = React.useMemo(() => {
    return listPlayers.slice(0, 10);
  }, [listPlayers]);


  return (
    <div className="All_Content_Leaderboard">
      <div className="Title_Leaderboard">
        <div className="The_Title_Leaderboard">Leaderboard</div>
        {/* <div className="Button_More"> */}
        <button className="Button_More" onClick={onclick}>
          More
        </button>
      </div>
      <div className="Table_Leaderboard">
        <div className="Title_Table_Leaderboard">
          <div className="the_Name Rank">Rank</div>
          <div className="the_Name UserName"> UserName</div>
          <div className="the_Name Top10">Top 10</div>
          <div className="the_Name Score">Score</div>
        </div>
        <div className="Inside_Leaderboard">
          {the_list.map((data, index) => (
            <div key={index} className="every_columns1">
              <div className="class_id1">#{index + 1}</div>
              <div>
                <img
                  src={'http://127.0.0.1:8000' + data.profile_image}
                  alt="photo_Profile"
                  className="class_img1"
                />
              </div>
              <div>{data.username}</div>
              <div>{data.points} Points</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

{
  /* {listPlayers.map((row, index) => {
  return(
    <div className="every_columns1" key={index} >
    </div>
    )}, */
}
// <div className="every_columns1" key={} >
//   {listPlayers.map((row) => {
//     // prepareRow(row);
//     // const { key, ...rowProps } = row.getRowProps();
//     return (
//       <tr className="dd11" key={key} {...rowProps}>
//         {row.cells.map((cell) => {
//           const { key: cellKey, ...cellProps } = cell.getCellProps({
//             className: cell.column.className,
//           });
//           return (
//             <td className="ss1" key={cellKey} {...cellProps}>
//               {cell.render("Cell")}
//             </td>
//           );
//         })}
//       </tr>
//     );
//   })}
// </div>

// const PlayerLeader = usePlayer();
// const list_leader = PlayerLeader.playerData;

// const data = useMemo(() => {
//   return list_leader.slice(0, 10);
// }, [list_leader]);

// const columns = useMemo(
//   () => [
//     {
//       Header: "Rank",
//       accessor: "_id",
//       className: "class_id1",
//     },
//     {
//       Header: "",
//       accessor: "Path_Image",
//       className: "class_img1",
//       Cell: ({ value }: { value: string }) => (
//         <img src={value} alt="Profile" style={{ borderRadius: "50%" }} />
//       ),
//     },
//     {
//       Header: "Player",
//       accessor: "User",
//       className: "class_player1",
//     },
//     {
//       Header: "Score",
//       accessor: "score",
//       className: "class_score1",
//     },
//   ],
//   []
// );

// const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//   useTable({ columns, data });
