import Player_Profil from '../../components/ui/game_comp/loby_profil';
import vs from '../../../public/vs_img.svg';
import Cookies from 'js-cookie';
import { usePlayer } from '../My_Profile/PlayerContext';
import Game_Remot from "./Game_Remot";
import { useEffect, useState } from 'react';

function Game_challeng( { name_plyar1, name_player2 } ) {
    const mydata = usePlayer();
    const [matchData, setMatchData] = useState(null);
    const token = Cookies.get("access_token");
    const [startGame, setStartGame] = useState(false);

    useEffect(() => {
        const matchmakingSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/challenge/?token=${token}`
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
            const timer = setTimeout(() => {
                setStartGame(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [matchData]);

    if (startGame) {
        return <Game_Remot id={matchData.match_id} />;
    }

    if (matchData) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-[url('../../../public/loby_back.svg')] bg-cover bg-center bg-no-repeat">
                <Player_Profil mydata={mydata.playerData} />
                <img src={vs} alt="vs tag" />
                <Player_Profil mydata={matchData.player1.username === mydata.playerData?.username ? matchData.player2 : matchData.player1 } />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-[url('../../../public/loby_back.svg')] bg-cover bg-center bg-no-repeat">
            <Player_Profil mydata={mydata.playerData} />
            <img src={vs} alt="vs tag" />
            <Player_Profil mydata={null} />
        </div>
    );
}

export default Game_challeng;
