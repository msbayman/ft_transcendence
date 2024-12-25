import * as React from "react";
import "./Table_Leaderboard.css";
import { useTable } from "react-table";
import FakeTable from "../Fake_Table.json";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import The_one from "../../Images/Leader_1.svg";
import The_two from "../../Images/Leader_2.svg";
import The_tree from "../../Images/Leader_3.svg";

const Table_Leaderboard = () => {
  const navig = useNavigate();

  const click_it = () => {
    navig("/Overview");
  };

  const data = useMemo(() => FakeTable, []);
  const columns = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "_id",
        className: "class_id",
      },
      {
        Header: "",
        accessor: "Path_Image",
        className: "class_img",
        Cell: ({ value, row }: { value: string; row: any }) => {
          const idString = row.original._id;
          const id = Number(idString.replace(/[^0-9]/g, ""));

          const rankImages: { [key: number]: string } = {
            1: The_one,
            2: The_two,
            3: The_tree,
          };

          return (
            <div>
              <img src={value} alt="Profile" style={{ borderRadius: "50%" }} />
              {rankImages[id] && <img src={rankImages[id]} className="top3" />}
            </div>
          );
        },
      },
      {
        Header: "Player",
        accessor: "User",
        className: "class_player",
      },
      {
        Header: "Score",
        accessor: "score",
        className: "class_score",
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }: any) => {
          const naame = row.original.User;
          return naame === "Kacimo" ? null : (
            <button onClick={click_it} className="view_Profile">
              {" "}
              View Profile{" "}
            </button>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="content_ofTable">
      <div className="title_of_table">
        <div className="content_of_title0">Rank</div>
        <div className="content_of_title1">Player</div>
        <div className="content_of_title2">Score</div>
        <div className="content_of_title3"></div>
      </div>
      <div className="the_table_leader">
        <div {...getTableProps()}>
          <div className="every_columns1" {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              const { key, ...rowProps } = row.getRowProps(); // Extract key
              return (
                <React.Fragment key={key}>
                  <div className="dd1" {...rowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } = cell.getCellProps({
                        className: cell.column.className,
                      });
                      return (
                        <div className="ss" key={cellKey} {...cellProps}>
                          {cell.render("Cell")}
                        </div>
                      );
                    })}
                  </div>
                  {index !== rows.length - 1 ? (
                    <hr className="seperator" />
                  ) : (
                    <hr className="seperator1" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table_Leaderboard;
