import * as React from "react"
import "./Table_Leaderboard.css"
import { useTable } from "react-table"
import FakeTable from "../Fake_Table.json"
import { useMemo } from "react";

const Table_Leaderboard = () => {
  console.log(FakeTable);
  const Data = useMemo(() => FakeTable,[])
  const colomns = useMemo(() => [
    {
      Header:"_id",
      accessor:"id",
    },
    {
      Header:"_Username",
      accessor:"User",
    },
    {
      Header:"_Photo_Profile",
      accessor:"Path_Image",
    },
    {
      Header:"_Score",
      accessor:"Score",
    },
  ],[])
  const { getTableProps,getTableBodyProps, headerGroups, rows, prepareRow } = useTable({colomns, Data});
  return (
    <div className="content_ofTable">
      {/* <div className="title_of_table">
        <div className="content_of_title">Rank</div>
        <div className="content_of_title">Player</div>
        <div className="content_of_title">Score</div>
        <div className="content_of_title"></div>
      </div>
      <div className="the_table_leader">
      </div> */}
        <table {...getTableProps()}>
          <thead></thead>
          <tbody></tbody>
        </table>
    </div>
  );
}

export default Table_Leaderboard