import Player_Profil from "../../components/ui/game_comp/loby_profil";
import Cookies from "js-cookie";
import { usePlayer } from "../My_Profile/PlayerContext";
import Game_Remot from "./Game_Remot";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { config } from "../../config";


interface MatchPlayer {
  username: string;
  profile_image: string;
  status: string;
  level: number;
}

interface MatchData {
  match_id: string;
  player1: MatchPlayer;
  player2: MatchPlayer;
}

interface PlayerData {
  username: string;
  profile_image: string;
  status: string;
  level: number;
}

function Game_Loby() {
  const mydata = usePlayer();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const token = Cookies.get("access_token");
  const [startGame, setStartGame] = useState(false);
  const location = useLocation();
  const { selectedIds } = location.state || {};
  const {  WS_HOST_URL } = config;

  useEffect(() => {
    const matchmakingSocket = new WebSocket(
      `${WS_HOST_URL}/ws/matchmaking/?token=${token}`
    );


    matchmakingSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMatchData(data);
    };
  }, [token, WS_HOST_URL]);

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
    const opponent: PlayerData = matchData.player1.username === mydata.playerData?.username 
            ? matchData.player2 
            : matchData.player1;
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
        <Player_Profil mydata={mydata.playerData || undefined} />
        <img src="/vs_img.svg" alt="vs tag" />

        < Player_Profil mydata={opponent} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
      <Player_Profil mydata={mydata.playerData || undefined} />
      <img src="/vs_img.svg" alt="vs tag" />
      <Player_Profil mydata={undefined} />
    </div>
  );
}

export default Game_Loby;
