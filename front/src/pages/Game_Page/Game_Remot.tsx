import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import table_game from "../../assets/table.svg";
import table_b from "../../assets/table_blue.svg";
import logo from "../../assets/logo_game.svg";

function Game_Remot() {

	const [socket, setSocket] = useState<WebSocket | null>(null);
	// const room_name  = 'room_1';
	const [gameState, setGameState] = useState({
		paddles: {left: 100, right: 100},
		ball: { x: 250, y: 365, dx: 0, dy: 0 },
		score: { player1: 0, player2: 0 },
	  });

	useEffect(() => {
		const token = Cookies.get("access_token");
		const ws = new WebSocket(`ws://127.0.0.1:8000/ws/game/?token=${token}`);

		ws.onopen = () => {
			console.log("Connected to WebSocket");
			setSocket(ws);
		};

		ws.onmessage = (event) => {
			const gameState = JSON.parse(event.data);
			setGameState({
				...gameState,
				paddles: {
					left: gameState.paddles.up,
					right: gameState.paddles.down,
				},
				ball:{
					x: gameState.ball.x,
					y: gameState.ball.y,
				},
				score:{
					player1: gameState.score.p1,
					player2: gameState.score.p2,
				}
			});
		};

		ws.onclose = () => console.log("WebSocket closed");
	}, []);

	const handleKeyPress = (event: KeyboardEvent) => {
		if (!socket) return;
		if (event.key === "a") {
			socket?.send(JSON.stringify({ paddle: "upP"}));
		}
		if (event.key === "d") {
			socket?.send(JSON.stringify({ paddle: "upD"}));
		}
		if (event.key === "r") {
			socket?.send(JSON.stringify({ paddle: "reset"}));
		}
	};

	useEffect(() => {
		// Attach key listener
		const keyListener = (event: KeyboardEvent) => handleKeyPress(event);
		window.addEventListener("keydown", keyListener);
		return () => window.removeEventListener("keydown", keyListener);
	  }, [socket]);

	return (
	  <>
		<div className="bg-custom-bg bg-cover bg-center h-screen w-full">
		  <div className="relative flex justify-center top-[90px]">
			{/* Table Images */}
			<img src={table_game} alt="table background" className="absolute" />
			<img
			  src={table_b}
			  alt="board"
			  className="absolute mx-auto top-[120px]"
			/>
  
			{/* Game Elements */}
			<div className="absolute">
			  <div className="relative w-[510px] h-[740px] mx-auto top-[120px]">
				{/* Left Paddle */}
				<div
				  className="absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear"
				  style={{ left: `${gameState.paddles.left}px` }}
				></div>
  
				{/* Right Paddle */}
				<div
				  className="absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear"
				  style={{ left: `${gameState.paddles.right}px` }}
				></div>
  
				{/* Ball */}
				<div
				  className="absolute w-[15px] h-[15px] bg-red-600 rounded-[50%]"
				  style={{ left: `${gameState.ball.x}px`, top: `${gameState.ball.y}px` }}
				></div>
			  </div>
			</div>
  
			{/* Score Display */}
			<div className="absolute text-6xl top-[920px] text-white z-10 font-luckiest">
			{gameState.score.player1} - {gameState.score.player2}
			</div>
  
			{/* Button Positioned Under Table */}
			<div className="absolute top-[1070px] z-20"></div>
  
			{/* Player Info */}
			<div className="absolute flex justify-center top-[30px] w-full px-4">
			  <div className="relative bg-[url('/public/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
				<p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[25px]">
				  player 1
				</p>
				<p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px]">
				  NoN
				</p>
			  </div>
			  <div className="flex justify-items-center">
				<img src={logo} alt="logo" />
			  </div>
			  <div className="relative bg-[url('/public/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
				<p className="absolute text-white text-4xl font-luckiest right-[25px]">
				  player 2
				</p>
				<p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px]">
				  NoN
				</p>
			  </div>
			</div>
		  </div>
		</div>
	  </>
	);
  }
  
  export default Game_Remot;
  
