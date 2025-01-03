import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import "./Leaderboard.css";
import FakeTable from "./Fake_Table.json"
import { useTable } from "react-table"


const Leaderboard = () => {
  const navigate = useNavigate();

  const onclick = () => {
    navigate("/Overview/Leadearboard");
  }

  const data = useMemo(() => FakeTable.slice(0,10),[FakeTable])
  const columns = useMemo(() => [
    {
      Header:"Rank",
      accessor:"_id",
      className:"class_id1",
    },
    {
      Header:"",
      accessor:"Path_Image",
      className:"class_img1",
      Cell: ({ value }: { value: string }) => (
        <img src={value} alt="Profile" style={{borderRadius:'50%'}}/>
      )
    },
    {
      Header:"Player",
      accessor:"User",
      className:"class_player1",
    },
    {
      Header:"Score",
      accessor:"score",
      className:"class_score1",
    },
  ],[])

  const { getTableProps,getTableBodyProps, headerGroups, rows, prepareRow } = useTable({columns, data});
  
  return (
    <div className="All_Content_Leaderboard">
      <div className="Title_Leaderboard">
        <div className="The_Title_Leaderboard">Leaderboard</div>
        {/* <div className="Button_More"> */}
          <button className="Button_More" onClick={onclick}>More</button>
      </div>
      <div className="Table_Leaderboard">
        <div className="Title_Table_Leaderboard">
          <div className="the_Name Rank">Rank</div>
          <div className="the_Name UserName"> UserName</div>
          <div className="the_Name Top10">Top 10</div>
          <div className="the_Name Score">Score</div>
        </div>
        <div className="Inside_Leaderboard">
        <table {...getTableProps()}>
          {/* <thead className="title_of_table">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((columns) => (
                  <th {...columns.getHeaderProps()}>
                    {columns.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead> */}
          <tbody className="every_columns1" {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr className="dd11"{...row.getRowProps()}>
                  {/* <hr /> */}
                  {row.cells.map((cell) => (
                    <td className="ss1" {...cell.getCellProps({className: cell.column.className})}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
