import Player_Profil from "../../components/ui/game_comp/loby_profil";
import Cookies from "js-cookie";
import { usePlayer } from "../My_Profile/PlayerContext";
import Game_Remot from "./Game_Remot";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { config } from "../../config";

function Game_Loby() {
  const mydata = usePlayer();
  interface MatchData {
    match_id: string;
    player1: { username: string };
    player2: { username: string };
  }

  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const token = Cookies.get("access_token");
  const [startGame, setStartGame] = useState(false);
  const location = useLocation();
  const { selectedIds } = location.state || {};
  const { HOST_URL, WS_HOST_URL } = config;

  useEffect(() => {
    const matchmakingSocket = new WebSocket(
      `${WS_HOST_URL}/ws/matchmaking/?token=${token}`
    );

    matchmakingSocket.onopen = () => {
      console.log("Connected to matchmaking");
    };

    matchmakingSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMatchData(data);
    };
  }, [token]);

  useEffect(() => {
    if (matchData) {
      const timer = setTimeout(() => {
        setStartGame(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [matchData]);

  if (startGame && matchData) {
    return <Game_Remot id={matchData.match_id} selectedIds={selectedIds}  />;
  }
  if (matchData) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
        <Player_Profil mydata={mydata.playerData} />
        <img src="/public/vs_img.svg" alt="vs tag" />

        <Player_Profil
          mydata={
            matchData.player1.username === mydata.playerData?.username
            ? matchData.player2
            : matchData.player1
          }
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
      <Player_Profil mydata={mydata.playerData} />
      <img src="/public/vs_img.svg" alt="vs tag" />
      <Player_Profil mydata={null} />
    </div>
  );
}

export default Game_Loby;
