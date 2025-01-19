// import React from 'react';
import Player_Profil from '../../components/ui/game_comp/loby_profil';
import vs from '../../../public/vs_img.svg';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';


function Game_Loby() {
    const [matchData, setMatchData] = useState(null);
    const token = Cookies.get("access_token");
    useEffect(() => {
        const matchmakingSocket = new WebSocket(
            `ws://127.0.0.1:8000/ws/matchmaking/?token=${token}`
        );

        matchmakingSocket.onopen = () => {
            console.log("Connected to matchmaking");
        };

        matchmakingSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type = "disconnect")
                
            setMatchData(data);
        }
    }, [token]);

    if (matchData) {
        <div className="flex justify-center items-center h-screen w-screen bg-[url('../../../public/loby_back.svg')] bg-cover bg-center bg-no-repeat">
            <Player_Profil name={matchData.player1.username} />
            <img src={vs} alt="vs tag" />
            <Player_Profil />
        </div>
    }
    return (
    <>
        <div className="flex justify-center items-center h-screen w-screen bg-[url('../../../public/loby_back.svg')] bg-cover bg-center bg-no-repeat">
            {/* {matchData.match_id} */}
            <Player_Profil/>
            <img src={vs} alt="vs tag" />
            <Player_Profil />
        </div>
    </>
    );
}

export default Game_Loby;
