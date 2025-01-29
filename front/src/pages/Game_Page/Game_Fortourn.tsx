import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import name from "../../assets/name_hold_game.svg";
// import logo from "../../../public/logo_game.svg";
// import Game_Tourn from "./Game_Torn";
import { TournContext } from './TournContext';

function Game_Tourn() {
  const [paddleLeftPosition, setPaddleLeftPosition] = useState(135);
  const [paddleRightPosition, setPaddleRightPosition] = useState(135);
  const [ballPosition, setBallPosition] = useState({ top: 370, left: 255});
  const [Ballscore, setBallscore] = useState({ l: 0, r: 0 });
  const [ballDirection, setBallDirection] = useState({ x: 3, y: 3 });
  const [isPaused, setIsPaused] = useState(false);
  const [iswin, setIswin] = useState("");
  const [lplayers, setlPlayers] = useState("");
  const [rplayers, setrPlayers] = useState("");
  const { tournamentState, setTournamentState } = useContext(TournContext);
  const navigate = useNavigate();

  const handleSleep = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  useEffect(() => {
    if (!tournamentState?.p1 || !tournamentState?.p2 || !tournamentState?.p3 || !tournamentState?.p4)
      navigate("/Overview");
    if (!tournamentState?.semi1)
    {
      setlPlayers(tournamentState?.p1);
      setrPlayers(tournamentState?.p3);
    }
    if (!tournamentState?.semi1)
    {
      setlPlayers(tournamentState?.p2);
      setrPlayers(tournamentState?.p4);
    }
    if (!tournamentState?.final)
    {
      setlPlayers(tournamentState?.semi1);
      setrPlayers(tournamentState?.semi2);
    }
    return;
  },[])

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

useEffect(() => {
  const interval = setInterval(async () => {
    if (isPaused) return;

    if (Ballscore.l === 3 || Ballscore.r === 3) {
      if (!tournamentState.semi1) {
        const winner = Ballscore.l === 3 ? tournamentState?.p1 : tournamentState?.p2;
        setTournamentState({ ...tournamentState, semi1: winner });
        setIswin(winner);
      } else if (!tournamentState.semi2) {
        const winner = Ballscore.l === 3 ? tournamentState?.p3 : tournamentState?.p4;
        setTournamentState({ ...tournamentState, semi2: winner });
        setIswin(winner);
      } else if (!tournamentState.final) {
        const winner = Ballscore.l === 3 ? tournamentState?.semi1 : tournamentState?.semi2;
        setTournamentState({ ...tournamentState, final: winner });
        setIswin(winner);
      }
      await handleSleep();
      clearInterval(interval);
      navigate("/tourn");
      return;
    }

    setBallPosition((prev) => {
      let newTop = prev.top + ballDirection.y;
      let newLeft = prev.left + ballDirection.x;

      // Ball collision with walls (left and right sides)
      if (newLeft <= 0 || newLeft >= 490) {
        setBallDirection({ x: -ballDirection.x, y: ballDirection.y });
      }

      const paddleWidth = 155;

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
		<div className="bg-cover bg-[url('/background.png')] bg-center h-screen w-full">
		  <div className="relative flex justify-center top-[90px] ">
			{/* Table Images */}
			<img src="/public/table.svg" alt="table background " className="absolute"/>
			<img src="/public/table_blue.svg" alt="baorde" className={isPaused || Ballscore.l == 3 || Ballscore.r == 3 ? "absolute mx-auto top-[120px] blur-sm" : "absolute mx-auto top-[120px]"} />

			{/* Game Elements */}
			<div className="absolute">
			  <div className="relative w-[510px] h-[740px] mx-auto top-[120px]">
				{/* pause */}
				<div className={isPaused ? "relative top-[340px] left-[155px] text-white font-luckiest text-6xl" : "hidden"}>
					PAUSED
				</div>
				<div className={Ballscore.l == 3 ? "relative top-[340px] left-[50px] text-white font-luckiest text-6xl" : "hidden"}>
				  {iswin} IS WIN
				</div>
				<div className={Ballscore.r == 3 ? "relative top-[340px] left-[50px] text-white font-luckiest text-6xl" : "hidden"}>
          {iswin} IS WIN
				</div>
				{/* Left Paddle */}
				<div
				  className={isPaused || Ballscore.l == 3 || Ballscore.r == 3  ? "absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear blur-sm" : "absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear"}
				  style={{ left: paddleLeftPosition }}
				></div>

				{/* Right Paddle */}
				<div
				  className={isPaused || Ballscore.l == 3 || Ballscore.r == 3 ? "absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear blur-sm" : "absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear"}
				  style={{ left: paddleRightPosition }}
				></div>
	  
				{/* Ball */}
				<div
				  className={isPaused || Ballscore.l == 3 || Ballscore.r == 3 ? "absolute w-[15px] h-[15px] bg-red-600 rounded-[50%] blur-sm" : "absolute w-[15px] h-[15px] bg-red-600 rounded-[50%]" }
				  style={{
					top: ballPosition.top,
					left: ballPosition.left,
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
			  src={isPaused ? "/public/puse.svg" : "/public/rus.svg"}
			  alt={isPaused ? "Resume" : "Pause"}
			  onClick={togglePause}
			  className="mt-4 cursor-pointer w-[50px] h-[50px]"
			/>
			</div>
          <div className="absolute flex justify-between items-center top-[30px]">
            <div className="relative bg-[url('/public/name_hlder_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
                <p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[25px] ">{lplayers}</p>
                <p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
            <div className="flex justify-items-center">
                <img src="/public/logo_game.svg" alt="logo"/>
            </div>
            <div className="relative bg-[url('/public/name_hlder_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
        		<p className="absolute text-white text-4xl font-luckiest right-[25px] ">{rplayers}</p>
            	<p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
          </div>
		  </div>
		</div>
	  );
}

export default Game_Tourn;