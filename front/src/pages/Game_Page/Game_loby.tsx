// import React from 'react';

function Game_Loby()
{
    const matchmakingSocket = new WebSocket("ws://127.0.0.1:8000/ws/matchmaking/");

    matchmakingSocket.onopen = () => {
        console.log("Connected to matchmaking");
    };

    matchmakingSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === "start_game") {
        console.log("Game starting with players:", data.players);
        // Navigate to the game room
        window.location.href = `/game/${data.room_name}`;
    }
    };
}

export default Game_Loby;