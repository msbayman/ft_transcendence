import React from "react";
import "./Recent_Game.css";

export const Recent_Game = () => {
  const win_or_lose = (check: string) => {
    return check === "WIN"
      ? "state_of_match green_color"
      : "state_of_match red_color";
  };
  const historyGame = [
    {
      id: 1,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 1,
      player2: "lwajdi",
    },
    {
      id: 2,
      player1: "Kacimo",
      status: "LOSE",
      score1: 2,
      score2: 5,
      player2: "ilyass",
    },
    {
      id: 3,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 4,
      player2: "ayman",
    },
    {
      id: 4,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 3,
      player2: "lwajdi",
    },
    {
      id: 5,
      player1: "Kacimo",
      status: "LOSE",
      score1: 3,
      score2: 4,
      player2: "lwajdi",
    },
    {
      id: 6,
      player1: "Kacimo",
      status: "LOSE",
      score1: 1,
      score2: 5,
      player2: "ayman",
    },
    {
      id: 7,
      player1: "Kacimo",
      status: "LOSE",
      score1: 0,
      score2: 5,
      player2: "ilyass",
    },
    {
      id: 8,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 4,
      player2: "user",
    },
    {
      id: 9,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 4,
      player2: "user",
    },
    {
      id: 10,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 4,
      player2: "user",
    },
    {
      id: 11,
      player1: "Kacimo",
      status: "WIN",
      score1: 5,
      score2: 4,
      player2: "user",
    },
  ];

  return (
    <div className="all_content_recent">
      <div className="rece_title">
        <div className="Title_Recent">RECENT GAMES</div>
        <div className="subTitle_Recent">(LAST 10 PLAYED)</div>
      </div>
      <div className="content_Recent">
        <div className="table_dd">
          {historyGame.map((field, index) => (
            <div key={index} className="inside_the_match_history">
              <div
                className={`${win_or_lose(
                  field.status
                )} pt-[30px] pr-[40px] pl-[30px] text-center flex flex-row w-[100%] gap-3 justify-between items-center`}
              >
                <div className="text-6xl">{field.status}</div>

                <div className="text-white font-alexandria text-lg pb-[18px]">
                  {" "}
                  21-12-2020{" "}
                </div>
              </div>
              <div className="who_played" key={field.id}>
                <div style={{ width: "150px", fontWeight: "600" }}>
                  {field.player1}
                </div>
                {/* <div> */}
                <div className="bg-white font-medium text-[#3a0ca3] pr-[20px] pl-[20px] rounded-3xl">
                  {field.score1} - {field.score2}
                </div>
                <div
                  style={{
                    width: "150px",
                    alignSelf: "end",
                    textAlign: "end",
                    fontWeight: "600",
                  }}
                >
                  {field.player2}
                </div>
              </div>
              {(index !== historyGame.length - 1 && (
                <span className="bar_sepe">
                  <hr />
                </span>
              )) || (
                <span className="bar_sepe1">
                  <hr />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recent_Game;
