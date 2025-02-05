import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { usePlayer } from '../My_Profile/PlayerContext';
import { config } from "../../config";

interface GameRemotProps {
	id: string;
	selectedIds?: { board?: number; paddel?: number; ball?: number };
}

function Game_Remot( { id , selectedIds }:GameRemotProps ) {
	const mydata = usePlayer();
	const [socket, setSocket] = useState<WebSocket | null>(null);
	  const { WS_HOST_URL } = config;
	const [gameState, setGameState] = useState({
		paddles: {up: 180, down: 180},
		ball: { x: 250, y: 365, dx: 5, dy: 5 },
		score: { player1: 0, player2: 0 },
		winner : null,
		side: {up: null, down: null}
	  });
	const navigate = useNavigate();

	  const SLIDEBOARDS = [
		{
		  mapPath: "/table_blue.svg",
		  id: 0,
		  mapName: "BlueBoard-Board",
		},
		{
		  mapPath: "green_table.svg",
		  id: 1,
		  mapName: "GreenBoard-Board",
		},
		{
		  mapPath: "/BrownBoard.svg",
		  id: 2,
		  mapName: "brownBoard",
		},
	  ];
	  
	  const SLIDECUES = [
		{
		  mapPath: "#2BBDB6",
		  id: 0,
		  mapName: "Cyan-Paddle",
		},
		{
		  mapPath: "#24BA26",
		  id: 1,
		  mapName: "Green-Paddle",
		},
		{
		  mapPath: "#FB2F98",
		  id: 2,
		  mapName: "N-Blossom-Paddles",
		},
		{
		  mapPath: "#7F00FF",
		  id: 3,
		  mapName: "Violet-Paddles",
		},
	  ];
	  
	  const SLIDEBALLS = [
		{ mapPath: "#FB2F98", id: 0, mapName: "pinkBall" },
		{ mapPath: "#24BA26", id: 1, mapName: "greenBall" },
		{ mapPath: "#2BBDB6", id: 2, mapName: "cyanBall" },
		{ mapPath: "#7F00FF", id: 3, mapName: "violetBall" },
	  ];
	var timer: number | undefined = undefined;

	useEffect(() => {
		const token = Cookies.get("access_token");
		const ws = new WebSocket(`${WS_HOST_URL}/ws/game/${id}/?token=${token}`);

		ws.onopen = () => {
			setSocket(ws);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type == "game_end")
			{
				timer = setTimeout(() => {
            		navigate("/Overview");
				  }, 2000);
			}
			else 
			{
				setGameState({
					...data,
					paddles: {
						up: data.paddles.up,
						down: data.paddles.down,
					},
					ball:{
						x: data.ball.x,
						y: data.ball.y,
					},
					score:{
						player1: data.score.p1,
						player2: data.score.p2,
					},
					side:{
						up: data.side.up,
						down: data.side.down,
					},
					winner: data.winner
				});
			}
		};

		ws.onclose = () => console.log("WebSocket closed");

		return () => {if (ws) ws.close(); clearTimeout(timer);}
	}, []);

	const handleKeyPress = (event: KeyboardEvent) => {
		if (!socket) return;
		if (event.key === "a") {
			socket?.send(JSON.stringify({ paddle: "upP"}));
		}
		if (event.key === "d") {
			socket?.send(JSON.stringify({ paddle: "upD"}));
		}
	};

	useEffect(() => {
		const keyListener = (event: KeyboardEvent) => handleKeyPress(event);
		window.addEventListener("keydown", keyListener);
		return () => window.removeEventListener("keydown", keyListener);
	  }, [socket]);

	return (
	  <>
		<div className="bg-[url('/background.png')] bg-cover bg-center h-screen w-full">
		  <div className="relative flex justify-center top-[90px]">
			{/* Table Images */}
			<img src="/table.svg" alt="table background" className="absolute" />
			<img
			  src={selectedIds?.board !== undefined ? SLIDEBOARDS[selectedIds.board]?.mapPath : SLIDEBOARDS[0].mapPath}
			  alt={selectedIds?.board !== undefined ? SLIDEBOARDS[selectedIds.board]?.mapName : SLIDEBOARDS[0].mapName}
			  className={gameState.winner ? "absolute mx-auto top-[120px] blur-sm" : "absolute mx-auto top-[120px]"}
			/>
  
			{/* Game Elements */}
			<div className="absolute">
				<div className={gameState.winner ? "relative top-[455px] text-center text-white font-luckiest text-6xl" : "hidden"}>
					{gameState.winner === mydata.playerData?.username ?  "You win!" : "You lose!"}
				</div>
			  <div className="relative w-[510px] h-[740px] mx-auto top-[120px]">
				{/* Left Paddle */}
				<div
				  className={gameState.winner ? "hidden" : "absolute w-[140px] h-[10px] top-[20px] transition-left duration-100 rounded-lg ease-linear"}
				  style={{ left: `${gameState.paddles.up}px`, backgroundColor: SLIDECUES[selectedIds?.paddel ?? 0].mapPath }}
				></div>

				{/* Right Paddle */}
				<div
				  className={gameState.winner ? "hidden" : "absolute w-[140px] h-[10px] transition-left bottom-[20px] duration-100 rounded-lg ease-linear"}
				  style={{	
							left: `${gameState.paddles.down}px`,
				  			backgroundColor: SLIDECUES[selectedIds?.paddel ?? 0].mapPath 
						}}
				></div>
  
				{/* Ball */}
				<div
				  className={gameState.winner ? "hidden" : "absolute w-[15px] h-[15px] transition-transform duration-100 ease-linear rounded-[50%] "}
				  style={{ left: `${gameState.ball.x}px`, top: `${gameState.ball.y}px`, backgroundColor: SLIDEBALLS[selectedIds?.ball ?? 0].mapPath }}
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
			  <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
				<p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[25px]">
				  {gameState.side.up}
				</p>
				<p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px]">
				  NoN
				</p>
			  </div>
			  <div className="flex justify-items-center">
				<img src="/logo_game.svg" alt="logo" />
			  </div>
			  <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
				<p className="absolute text-white text-4xl font-luckiest right-[25px]">
				{gameState.side.down}
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
  
  
