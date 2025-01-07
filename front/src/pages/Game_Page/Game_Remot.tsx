// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import table_game from "../../assets/table.svg";
import table_b from "../../assets/table_blue.svg";
import pause from "../../assets/puse.svg";
import rus from "../../assets/rus.svg";
// import name from "../../assets/name_hold_game.svg";
import logo from "../../assets/logo_game.svg";

function Game_Remot() {
  return (
		<div className="bg-custom-bg bg-cover bg-center h-screen w-full">
		  <div className="relative flex justify-center top-[90px] ">
			{/* Table Images */}
			<img src={table_game} alt="table background " className="absolute"/>
			<img src={table_b} alt="baorde" className={isPaused || Ballscore.l == 3 || Ballscore.r == 3 ? "absolute mx-auto top-[120px] blur-sm" : "absolute mx-auto top-[120px]"} />

			{/* Game Elements */}
			<div className="absolute">
			  <div className="relative w-[510px] h-[740px] mx-auto top-[120px]">
				{/* pause */}
				<div className={isPaused ? "relative top-[340px] left-[155px] text-white font-luckiest text-6xl" : "hidden"}>
					PAUSED
				</div>
				<div className={Ballscore.l == 3 ? "relative top-[340px] left-[50px] text-white font-luckiest text-6xl" : "hidden"}>
					PALYER 1 IS WIN
				</div>
				<div className={Ballscore.r == 3 ? "relative top-[340px] left-[50px] text-white font-luckiest text-6xl" : "hidden"}>
					PALYER 2 IS WIN 
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
			  src={isPaused ? pause : rus}
			  alt={isPaused ? "Resume" : "Pause"}
			  onClick={togglePause}
			  className="mt-4 cursor-pointer w-[50px] h-[50px]"
			/>
			</div>
          <div className="absolute flex justify-between items-center top-[30px]">
            <div className="relative bg-[url('/public/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
                <p className="absolute text-white text-4xl transform scale-x-[-1] font-luckiest right-[25px] ">player 1</p>
                <p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
            <div className="flex justify-items-center">
                <img src={logo} alt="logo"/>
            </div>
            <div className="relative bg-[url('/public/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
        		<p className="absolute text-white text-4xl font-luckiest right-[25px] ">player 2</p>
            	<p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px] ">NoN</p>
            </div>
          </div>
		  </div>
		</div>
	  );
}
export default Game_Remot;
