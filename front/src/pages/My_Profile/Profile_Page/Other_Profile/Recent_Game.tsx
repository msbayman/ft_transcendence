import React from "react";
import other from './Recent_Game.module.css'

export const Recent_Game = () => {
  const win_or_lose = (check: string) => {
    return check === "WIN"
      ? `${other.state_of_match} ${other.green_color}`
      : `${other.state_of_match} ${other.red_color}`;
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
    <div className={other.all_content_recent}>
      <div className={other.rece_title}>
        <div className={other.Title_Recent}>RECENT GAMES</div>
        <div className={other.subTitle_Recent}>(LAST 10 PLAYED)</div>
      </div>
      <div className={other.content_Recent}>
        <div className={other.table_dd}>
          {historyGame.map((field, index) => (
            <div key={index} className={other.inside_the_match_history}>
              <div className={`${win_or_lose(field.status)}`}>{field.status}</div>
              <div className={other.who_played} key={field.id}>
                <div style={{ width: "150px", fontWeight: "600" }}>
                  {field.player1}
                </div>
                <div>
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
                <span className={other.bar_sepe}>
                  <hr />
                </span>
              )) || (
                <span className={other.bar_sepe1}>
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
