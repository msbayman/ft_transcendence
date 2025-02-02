import Player_Profil from '../../components/ui/game_comp/loby_profil';
import Cookies from 'js-cookie';
import { usePlayer } from '../My_Profile/PlayerContext';
import Game_Remot from "./Game_Remot";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Game_challeng() {
    const { state } = useLocation();
    const { challenger, challenged } = state || {};
    const mydata = usePlayer();
    const [matchData, setMatchData] = useState(null);
    const token = Cookies.get("access_token");
    const [startGame, setStartGame] = useState(false);


    
    useEffect(() => {
        const name_socket = challenged + '+' + challenger;
        const matchmakingSocket = new WebSocket(
            `wss://localhost/ws/challenge/${name_socket}/?token=${token}`
        );

        matchmakingSocket.onopen = () => {
            console.log("Connected to matchmaking");
        };

        matchmakingSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("------ match found ------")
            setMatchData(data);
        }
    }, [token]);

    useEffect(() => {
        if (matchData) {
            console.log("challenger: ", challenger, "challenged: ", challenged);
            const timer = setTimeout(() => {
                setStartGame(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [matchData]);

    if (startGame) {
        return <Game_Remot id={matchData.match_id} selectedIds={null} />;
    }

    if (matchData) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
                <Player_Profil mydata={mydata.playerData} />
                <img src="/public/vs_img.svg" alt="vs tag" />
                <Player_Profil mydata={matchData.player1.username === mydata.playerData?.username ? matchData.player2 : matchData.player1 } />
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


export default Game_challeng;
