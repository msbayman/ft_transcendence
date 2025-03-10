import other from "./Recent_Game.module.css";
import { data_of_player } from "./interface";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { config } from "../../../../config";

interface data_interface {
  other_data: data_of_player | null;
}

export const Recent_Game = ({ other_data }: data_interface) => {
  const token = Cookies.get("access_token");
  const { HOST_URL } = config;
  interface Match {
    game_type:boolean;
    player1: string;
    player2: string;
    player1_score: number;
    player2_score: number;
    date: string;
  }

  const [historyGame, setHistoryGame] = useState<Match[]>([]);

  useEffect(() => {
    const get_data = async () => {
      try {
        const response = await fetch(
          `${HOST_URL}/api/game/get_match/${other_data?.username}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const info = await response.json();
          setHistoryGame(info);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    get_data();
  }, []);

  const win_or_lose_state = (
    player1_score: number,
    player2_score: number,
    username: string | undefined,
    player1: string,
    player2: string
  ) => {
    if (!username) return "state_of_match";
    if (username === player1) {
      return player1_score > player2_score ? "WIN" : "LOSE";
    }
    if (username === player2) {
      return player2_score > player1_score ? "WIN" : "LOSE";
    }
  };
  const win_or_lose = (
    player1_score: number,
    player2_score: number,
    username: string | undefined,
    player1: string,
    player2: string
  ) => {
    if (!username) return "state_of_match";
    if (username === player1) {
      return player1_score > player2_score
        ? `${other.state_of_match} ${other.green_color}`
        : `${other.state_of_match} ${other.red_color}`;
    } else if (username === player2) {
      return player2_score > player1_score
        ? `${other.state_of_match} ${other.green_color}`
        : `${other.state_of_match} ${other.red_color}`;
    }
    return "state_of_match";
  };

  const type_of_game = (game_type:boolean):string => {
    return (game_type === false ? "Ping Pong" : "RPS")
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={other.all_content_recent}>
      <div className={other.rece_title}>
        <div className={other.Title_Recent}>RECENT GAMES</div>
        <div className={other.subTitle_Recent}>( ALL GAMES PLAYED )</div>
      </div>
      <div className={other.content_Recent}>
        <div className={other.table_dd}>
          {historyGame.length > 0 ? (
            historyGame.map((field, index) => (
              <div key={index} className="inside_the_match_history">
                <div
                  className={`${win_or_lose(
                    field.player1_score,
                    field.player2_score,
                    other_data?.username,
                    field.player1,
                    field.player2
                  )} pt-[30px] pr-[30px] pl-[30px] text-center flex flex-row w-[100%] gap-3 justify-between items-center`}
                >
                  {win_or_lose_state(
                    field.player1_score,
                    field.player2_score,
                    other_data?.username,
                    field.player1,
                    field.player2
                  )}
                  <div className="text-white font-alexandria text-lg pb-[18px]">{type_of_game(field.game_type)}</div>
                  <div className="text-white font-alexandria text-lg pb-[18px]">
                    {formatDate(field.date)}
                  </div>
                </div>
                <div className="who_played" key={index}>
                  <div style={{ width: "150px", fontWeight: "600" }}>
                    {field.player1}
                  </div>
                  <div className="bg-white font-medium text-[#3a0ca3] pr-[20px] pl-[20px] rounded-3xl">
                    {field.player1_score} - {field.player2_score}
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
                {index !== historyGame.length - 1 && (
                  <span className="bar_sepe">
                    <hr />
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-white text-center py-4">No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recent_Game;
