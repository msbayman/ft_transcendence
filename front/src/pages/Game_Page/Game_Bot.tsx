import { useState, useEffect } from "react";
import table_game from "../../assets/table.svg";
import table_b from "../../assets/table_blue.svg";
import pause from "../../assets/puse.svg";
import rus from "../../assets/rus.svg";
import logo from "../../assets/logo_game.svg";

function Game_Bot() {
  const [paddleLeftPosition, setPaddleLeftPosition] = useState(135);
  const [paddleRightPosition, setPaddleRightPosition] = useState(135);
  const [ballPosition, setBallPosition] = useState({ top: 240, left: 175 });
  const [Ballscore, setBallscore] = useState({ l: 0, r: 0 });
  const [ballDirection, setBallDirection] = useState({ x: 3, y: 3 });
  const [isPaused, setIsPaused] = useState(false);

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
    if (isPaused) return;
  
    const botInterval = setInterval(() => {
      setPaddleLeftPosition((prev) => {
        const paddleCenter = prev + 75; // Paddle width is 150px, so the center is 75px from the left edge.
        const ballCenter = ballPosition.left; // The center of the ball.
        const moveStep = 5; // Speed at which the bot paddle moves.
  
        // Adjust paddle position to follow the ball.
        if (paddleCenter < ballCenter) {
          return Math.min(prev + moveStep, 365); // Ensure the paddle stays within bounds (0 to 365).
        } else if (paddleCenter > ballCenter) {
          return Math.max(prev - moveStep, 5); // Ensure the paddle stays within bounds (0 to 365).
        }
        return prev; // If the paddle center aligns with the ball center, no movement.
      });
    }, 20); // Update the bot paddle position every 20ms.
  
    return () => clearInterval(botInterval); // Cleanup interval on unmount.
  }, [ballPosition.left, isPaused]);

 // Ball Movement and Collision Logic
useEffect(() => {
  const interval = setInterval(() => {
    if (isPaused) return;

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
        if (newTop > 740) {
          setBallscore({ l: Ballscore.l + 1, r: Ballscore.r });
          setBallDirection({ x: 3, y: 3 });
          resetBall();
        }

        return { top: newTop, left: newLeft };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [ballDirection, paddleLeftPosition, paddleRightPosition, isPaused]);

  function togglePause() {
    setIsPaused((prev) => !prev);
  }

  const resetBall = () => {
    setBallPosition({ top: 370, left: 255 });
  };

	return (
		<div className="bg-custom-bg bg-cover bg-center h-screen w-full">
		  <div className="relative flex justify-center top-[90px]">
			{/* Table Images */}
			<img src={table_game} alt="" className="absolute" />
			<img src={table_b} alt="" className={isPaused ? "absolute mx-auto top-[120px] blur-sm" : "absolute mx-auto top-[120px]"} />
	  
			{/* Game Elements */}
			<div className="absolute">
			  <div className="relative w-[510px] h-[740px] mx-auto top-[120px]">
        {/* pause */}
        <div className={isPaused ? "relative top-[340px] left-[155px] text-white font-luckiest text-6xl" : "hidden"}>
					PAUSED
				</div>
				{/* Left Paddle */}
				<div
				  className={isPaused ? "absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear blur-sm" : "absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear"}
				  style={{ left: paddleLeftPosition - 50 }}
				></div>
	  
				{/* Right Paddle */}
				<div
				  className={isPaused ? "absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear blur-sm": "absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear"}
				  style={{ left: paddleRightPosition }}
				></div>
	  
				{/* Ball */}
				<div
				  className={isPaused ? "absolute w-[15px] h-[15px] bg-red-600 rounded-[50%] blur-sm" : "absolute w-[15px] h-[15px] bg-red-600 rounded-[50%]" }
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
			  src={isPaused ? rus : pause}
			  alt={isPaused ? "Resume" : "Pause"}
			  onClick={togglePause}
			  className="mt-4 cursor-pointer w-[50px] h-[50px]"
			/>
			</div>
        <div className="absolute flex justify-between items-center top-[30px]">
            <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
                <p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[70px] ">YOU</p>
                <p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
            <div className="flex justify-items-center">
                <img src={logo} alt="logo"/>
            </div>  
            <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
        		<p className="absolute text-white text-4xl font-luckiest right-[70px] ">BOT</p>
            	<p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
            {/* Left Paddle */}
            <div
              className={
                isPaused
                  ? "absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear blur-sm"
                  : "absolute w-[140px] h-[10px] bg-[#0026EB] top-[20px] transition-left duration-100 rounded-lg ease-linear"
              }
              style={{ left: ballPosition.left }}
            ></div>

            {/* Right Paddle */}
            <div
              className={
                isPaused
                  ? "absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear blur-sm"
                  : "absolute w-[140px] h-[10px] bg-[#FFE500] transition-left bottom-[20px] duration-100 rounded-lg ease-linear"
              }
              style={{ left: paddleRightPosition }}
            ></div>

            {/* Ball */}
            <div
              className={
                isPaused
                  ? "absolute w-[15px] h-[15px] bg-red-600 rounded-[50%] blur-sm"
                  : "absolute w-[15px] h-[15px] bg-red-600 rounded-[50%]"
              }
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
            src={isPaused ? rus : pause}
            alt={isPaused ? "Resume" : "Pause"}
            onClick={togglePause}
            className="mt-4 cursor-pointer w-[50px] h-[50px]"
          />
        </div>
        <div className="absolute flex justify-between items-center top-[30px]">
          <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
            <p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[70px] ">
              YOU
            </p>
            <p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px] ">
              NoN
            </p>
          </div>
          <div className="flex justify-items-center">
            <img src={logo} alt="logo" />
          </div>
          <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
            <p className="absolute text-white text-4xl font-luckiest right-[70px] ">
              BOT
            </p>
            <p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px] ">
              NoN
            </p>
          </div>
        </div>
      </div>
  );
}

export default Game_Bot;
