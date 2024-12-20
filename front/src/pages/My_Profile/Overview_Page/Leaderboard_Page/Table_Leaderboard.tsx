import * as React from "react"
import "./Table_Leaderboard.css"
import { useTable } from "react-table"
import FakeTable from "../Fake_Table.json"
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";


const Table_Leaderboard = () => {
  const navig = useNavigate();

  const click_it = () => {
    navig("/Overview");
  }

  const data = useMemo(() => FakeTable,[])
  const columns = useMemo(() => [
    {
      Header:"Rank",
      accessor:"_id",
      className:"class_id",
    },
    {
      Header:"",
      accessor:"Path_Image",
      className:"class_img",
      Cell: ({ value }: { value: string }) => (
        <img src={value} alt="Profile" style={{borderRadius:'50%'}}/>
      )
    },
    {
      Header:"Player",
      accessor:"User",
      className:"class_player",
    },
    {
      Header:"Score",
      accessor:"score",
      className:"class_score",
    },
    {
      Header:"Actions",
      id:"actions",
      Cell: ({ row }:any) => {
        const naame = row.original.User;
        return naame === 'Kacimo' ? null : (
        <button onClick={click_it} className="view_Profile"> View Profile </button>
      )},
    }
  ],[])

  const { getTableProps,getTableBodyProps, headerGroups, rows, prepareRow } = useTable({columns, data});
  
  return (
    <div className="content_ofTable">
      <div className="title_of_table">
        <div className="content_of_title0">Rank</div>
        <div className="content_of_title1">Player</div>
        <div className="content_of_title2">Score</div>
        <div className="content_of_title3"></div>
      </div>
      <div className="the_table_leader">

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
          <tbody className="every_columns" {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr className="dd1"{...row.getRowProps()}>
                  <hr />
                  {row.cells.map((cell) => (
                    <td className="ss" {...cell.getCellProps({className: cell.column.className})}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table_Leaderboard