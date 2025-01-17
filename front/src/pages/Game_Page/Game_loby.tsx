// import React from 'react';
// import Player_Profil from '../../components/ui/game_comp/loby_profil';
// import vs from '../../../public/vs_img.svg';


function Game_Loby() {
  const matchmakingSocket = new WebSocket(
    "ws://127.0.0.1:8000/ws/matchmaking/"
  );

  matchmakingSocket.onopen = () => {
    console.log("Connected to matchmaking");
  };

  matchmakingSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
      console.log(
        "Game starting with players:",
        data.player1,
        "and",
        data.player2,
        "id of the match",
        data.id
      );
  }
    return (
       <>
       <div className="flex justify-center items-center h-screen w-screen bg-[url('../../../public/loby_back.svg')] bg-cover bg-center bg-no-repeat">
         {/* <Player_Profil /> */}
         {/* <img src={vs} alt="vs tag" /> */}
         {/* <Player_Profil /> */}
       </div>
       </>
    );
}

export default Game_Loby;
