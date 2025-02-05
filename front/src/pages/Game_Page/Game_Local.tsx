import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Game_Local() {
  const [paddleLeftPosition, setPaddleLeftPosition] = useState(135);
  const [paddleRightPosition, setPaddleRightPosition] = useState(135);
  const [ballPosition, setBallPosition] = useState({ top: 370, left: 255});
  const [Ballscore, setBallscore] = useState({ l: 0, r: 0 });
  const [ballDirection, setBallDirection] = useState({ x: 3, y: 3 });
  const [isPaused, setIsPaused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedIds } = location.state || {};

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
  


  const handleSleep = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  useEffect(() => {
    if (isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "a":
          setPaddleLeftPosition((prev) => Math.max(prev - 20, 5));
          break;
        case "d":
          setPaddleLeftPosition((prev) => Math.min(prev + 20, 365));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused]);


  useEffect(() => {
    if (isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setPaddleRightPosition((prev) => Math.max(prev - 20, 5));
          break;
        case "ArrowRight":
          setPaddleRightPosition((prev) => Math.min(prev + 20, 365));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused]);

 // Ball Movement and Collision Logic
useEffect(() => {
  const interval = setInterval(() => {
    if (isPaused) return;

    if (Ballscore.l === 5 || Ballscore.r === 5) {
      clearInterval(interval);
      handleSleep();
      navigate("/Overview");
      return;
      return ;
    }

    setBallPosition((prev) => {
      let newTop = prev.top + ballDirection.y;
      let newLeft = prev.left + ballDirection.x;

      // Ball collision with walls (left and right sides)
      if (newLeft <= 0 || newLeft >= 490) {
        setBallDirection({ x: -ballDirection.x, y: ballDirection.y });
      }

      const paddleWidth = 150;

      // Ball collision with top paddle
      if (
        newTop <= 27 &&
        newLeft >= paddleLeftPosition &&
        newLeft <= paddleLeftPosition + paddleWidth
      ) {
        const impactPoint =
          (newLeft - paddleLeftPosition) / paddleWidth - 0.5;
        setBallDirection({
          x: ballDirection.x + impactPoint * 4,
          y: Math.abs(ballDirection.y),
        });
      }

      // Ball collision with bottom paddle
      if (
        newTop >= 700 &&
        newLeft >= paddleRightPosition &&
        newLeft <= paddleRightPosition + paddleWidth
      ) {
        const impactPoint =
          (newLeft - paddleRightPosition) / paddleWidth - 0.5;
        setBallDirection({
          x: ballDirection.x + impactPoint * 4,
          y: -Math.abs(ballDirection.y),
        });
      }

      // Ball crosses the top boundary (right player scores)
      if (newTop < 0) {
        setBallscore({ l: Ballscore.l, r: Ballscore.r + 1 });
        setBallDirection({ x: 3, y: 3 });
        resetBall();
      }

      // Ball crosses the bottom boundary (left player scores)
      if (newTop > 725) {
        setBallscore({ l: Ballscore.l + 1, r: Ballscore.r });
        setBallDirection({ x: 3, y: 3 });
        resetBall();
      }
      return { top: newTop, left: newLeft };
    });
  }, 20);

  return () => clearInterval(interval);
}, [ballDirection, paddleLeftPosition, paddleRightPosition, isPaused, Ballscore.l, Ballscore.r]);

function togglePause() {
  setIsPaused((prev) => !prev);
}

const resetBall = () => {
  setBallPosition({ top: 370, left: 255 });
};

	return (
		<div className="bg-[url('/background.png')] bg-cover bg-center h-screen w-full">
		  <div className="relative flex justify-center top-[90px] ">
			{/* Table Images */}
			<img src="/table.svg" alt="table background " className="absolute"/>
			<img src={SLIDEBOARDS[selectedIds?.board ?? 0].mapPath} alt={SLIDEBOARDS[selectedIds?.board ?? 0].mapPath}  className={isPaused || Ballscore.l == 5 || Ballscore.r == 5 ? "absolute mx-auto top-[120px] blur-sm" : "absolute mx-auto top-[120px]"} />

			{/* Game Elements */}
			<div className="absolute">
			  <div className="relative w-[510px] h-[740px] mx-auto top-[120px]">
				{/* pause */}
				<div className={isPaused ? "relative top-[340px] left-[155px] text-white font-luckiest text-6xl" : "hidden"}>
					PAUSED
				</div>
				<div className={Ballscore.l == 5 ? "relative top-[340px] left-[50px] text-white font-luckiest text-6xl" : "hidden"}>
					player1 IS WIN
				</div>
				<div className={Ballscore.r == 5 ? "relative top-[340px] left-[50px] text-white font-luckiest text-6xl" : "hidden"}>
					player2 IS WIN 
				</div>
				{/* Left Paddle */}
				<div
				  className={isPaused || Ballscore.l == 5 || Ballscore.r == 5  ? "absolute w-[140px] h-[10px] top-[20px] transition-left duration-100 rounded-lg ease-linear blur-sm" : "absolute w-[140px] h-[10px] top-[20px] transition-left duration-100 rounded-lg ease-linear"}
				  style={{ left: paddleLeftPosition, backgroundColor: SLIDECUES[selectedIds?.paddel ?? 0].mapPath }}
				></div>

				{/* Right Paddle */}
				<div
				  className={isPaused || Ballscore.l == 5 || Ballscore.r == 5 ? "absolute w-[140px] h-[10px] transition-left bottom-[20px] duration-100 rounded-lg ease-linear blur-sm" : "absolute w-[140px] h-[10px] transition-left bottom-[20px] duration-100 rounded-lg ease-linear"}
				  style={{ left: paddleRightPosition, backgroundColor: SLIDECUES[selectedIds?.paddel ?? 0].mapPath }}
				></div>
	  
				{/* Ball */}
				<div
				  className={isPaused || Ballscore.l == 5 || Ballscore.r == 5 ? "absolute w-[15px] h-[15px] rounded-[50%] blur-sm" : "absolute w-[15px] h-[15px] rounded-[50%]" }
				  style={{
					top: ballPosition.top,
					left: ballPosition.left,
          backgroundColor: SLIDEBALLS[selectedIds?.ball ?? 0].mapPath
				  }}
				></div>
			  </div>
			</div>

			{/* Score Display */}
			<div className="absolute text-6xl top-[920px] text-white z-10 font-luckiest">
			  {Ballscore.l} - {Ballscore.r}
			</div>
	  
			{/* Button Positioned Under Table */}
			<div className="absolute top-[1070px] z-20">
			<img
			  src={isPaused ? "/puse.svg" : "/rus.svg"}
			  alt={isPaused ? "Resume" : "Pause"}
			  onClick={togglePause}
			  className="mt-4 cursor-pointer w-[50px] h-[50px]"
			/>
			</div>
          <div className="absolute flex justify-between items-center top-[30px]">
            <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
                <p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[25px] ">player1</p>
                <p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
            <div className="flex justify-items-center">
                <img src="/logo_game.svg" alt="logo"/>
            </div>
            <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
        		<p className="absolute text-white text-4xl font-luckiest right-[25px] ">player2</p>
            	<p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
          </div>
		  </div>
		</div>
	  );
}

export default Game_Local;