import { useEffect, useState } from "react";
import "./Recent_Game.css";
import { usePlayer } from "../PlayerContext";
import Cookies from "js-cookie";
import { config } from "../../../config";
export const Recent_Game = () => {
  const token = Cookies.get("access_token");

  interface Match {
    game_type: boolean;
    player1: string;
    player2: string;
    player1_score: number;
    player2_score: number;
    date: string;
  }

  const my_data = usePlayer();
  const [historyGame, setHistoryGame] = useState<Match[]>([]);
  const username = my_data.playerData?.username;
  const { HOST_URL } = config;
  useEffect(() => {
    const get_data = async () => {
      try {
        const response = await fetch(
          `${HOST_URL}/api/game/get_match/${username}/`,
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
  const type_of_game = (game_type:boolean):string => {
    return (game_type === false ? "Ping Pong" : "RPS")
  }
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
        ? "state_of_match green_color"
        : "state_of_match red_color";
    } else if (username === player2) {
      return player2_score > player1_score
        ? "state_of_match green_color"
        : "state_of_match red_color";
    }
    return "state_of_match";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour:"2-digit",
      minute:"2-digit"
    });
  };

  return (
    <div className="all_content_recent">
      <div className="rece_title">
        <div className="Title_Recent">RECENT GAMES</div>
        <div className="subTitle_Recent">( ALL GAMES PLAYED )</div>
      </div>
      <div className="content_Recent">
        <div className="table_dd">
          {historyGame.length > 0 ? (
            historyGame.map((field, index) => (
              <div key={index} className="inside_the_match_history">
                <div className={`${win_or_lose( field.player1_score, field.player2_score, username, field.player1, field.player2 )} pt-[30px] pr-[30px] pl-[30px] text-center flex flex-row w-[100%] gap-3 justify-between items-center`}>
                  {win_or_lose_state(field.player1_score,field.player2_score,username,field.player1,field.player2)}
                  <div className="text-white font-alexandria text-lg pb-[18px]">{type_of_game(field.game_type)}</div>
                  <div className="text-white font-alexandria text-lg pb-[18px]">{formatDate(field.date)}</div>
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
            <div className="flex gap-[10px] justify-center items-center text-white text-center py-4">
              <img className="w-[20px] h-[20px]" src="/Navbar/No.png" alt="" />
              No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recent_Game;