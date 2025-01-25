import React from "react";
import { usePlayer } from "../My_Profile/PlayerContext";

const Tournaments = () => {
  const my_data = usePlayer();
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-[url('/background.png')] bg-cover bg-center pb-[50px]">
      <div className="flex justify-center items-center flex-col w-[100%] max-w-[1600px] h-[100%] gap-[10px]">
        {/* -------------------------------------------------->>> part1 title*/}

        <div className="text-white font-alexandria text-center font-bold text-[100px] p-6 tracking-wider">
          Tournament
        </div>

        {/* -------------------------------------------------->>> part2 content-players*/}

        <div className="flex flex-col gap-[80px] w-[100%] h-[100%] justify-center items-center max-h-[1100px]">
          {/* -------------------------------------------------->>> part2 - 1 final */}

          <div className="flex justify-center items-center rounded-[30px] bg-white w-[430px] h-[240px]">
            final
          </div>
          {/* -------------------------------------------------->>> part2 - 2 qualif_1 ------------------------------------------------------------------*/}
          <div className="flex flex-row justify-around items-start gap-[30px] w-full">
            <div className="flex flex-col items-center gap-[20px] justify-center h-[100%] w-2/6 ">
              <div className="flex justify-center items-center h-[280px] w-[40%] bg-white rounded-[40px]"></div>

              {/* -------------------- start style hr ---------------------------- */}
              <div className="flex flex-col justify-center items-center h-[120px] w-[100%]">
                <div className="h-[40px] w-[5px] bg-white"></div>
                <div className="h-[5px] w-[60%] bg-white"></div>
                <div className="flex flex-row w-[60%] justify-between ">
                  <div className="h-[40px] w-[5px] bg-white"></div>
                  <div className="h-[40px] w-[5px] bg-white"></div>
                </div>
              </div>
              {/* -------------------- end style hr ---------------------------- */}

              <div className="flex flex-row justify-between items-center h-[280px] w-[100%]">
                <div className="h-[100%] w-[40%] bg-white rounded-[30px]"></div>
                <div className="h-[100%] w-[40%] bg-white rounded-[30px]"></div>
              </div>
            </div>

            {/* -------------------------------------------------->>> part2 (style horisantal rule) -----------------------------------------------------------*/}
            <div className="flex flex-col justify-center items-center w-[30%] self-start">
              <div className="h-[150px] w-[5px] bg-white"></div>
              <div className="h-[5px] w-[150%] bg-white"></div>
            </div>
            {/* -------------------------------------------------->>> part2 - 2 qualif_2 -----------------------------------------------------------*/}
            <div className="flex flex-col items-center gap-[20px] justify-center h-[100%] w-2/6 ">
              <div className="flex justify-center items-center h-[280px] w-[40%] bg-white rounded-[40px]"></div>

              {/* -------------------- start style hr ---------------------------- */}
              <div className="flex flex-col justify-center items-center h-[120px] w-[100%]">
                <div className="h-[40px] w-[5px] bg-white"></div>
                <div className="h-[5px] w-[60%] bg-white"></div>
                <div className="flex flex-row w-[60%] justify-between ">
                  <div className="h-[40px] w-[5px] bg-white"></div>
                  <div className="h-[40px] w-[5px] bg-white"></div>
                </div>
              </div>
              {/* -------------------- end style hr ---------------------------- */}

              <div className="flex flex-row justify-between items-center h-[280px] w-[100%]">
                <div className="h-[100%] w-[40%] bg-white rounded-[30px]"></div>
                <div className="h-[100%] w-[40%] bg-white rounded-[30px]"></div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------->>> part3 button*/}

          <div className="flex justify-center items-center bg-white text-[#3A0CA3] w-[220px] h-[70px] rounded-[30px] font-alexandria text-4xl">
            Play
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
