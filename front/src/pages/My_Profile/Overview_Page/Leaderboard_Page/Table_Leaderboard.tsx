import * as React from "react"
import "./Table_Leaderboard.css"
import { useTable } from "react-table"
import FakeTable from "../Fake_Table.json"
import { useMemo } from "react";

const Table_Leaderboard = () => {
  console.log(FakeTable);
  const data = useMemo(() => FakeTable,[])
  const columns = useMemo(() => [
    {
      Header:"Rank",
      accessor:"id",
      className:"class_id"
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
    },
    {
      Header:"Score",
      accessor:"score",
    },
  ],[])
  const { getTableProps,getTableBodyProps, headerGroups, rows, prepareRow } = useTable({columns, data});
  return (
    <div className="content_ofTable">
      <div className="title_of_table">
        <div className="content_of_title">Rank</div>
        <div className="content_of_title">Player</div>
        <div className="content_of_title">Score</div>
        <div className="content_of_title"></div>
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
                  {row.cells.map((cell) => (
                    <td className="ss" {...cell.getCellProps({className: cell.column.className,})}>{cell.render("Cell")}</td>
                  ))}
                <hr /></tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table_Leaderboard