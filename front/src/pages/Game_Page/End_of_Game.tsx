
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../My_Profile/PlayerContext";
import { useLocation } from "react-router-dom";

const End_of_Game = () => {
  const navigate = useNavigate();
  const data = usePlayer();
  const location = useLocation();
  const gameState = location.state?.gameState;


  const navig_to_home = () => {
    navigate("/Overview");
  };

  console.log("-------> ", gameState?.winner);
  return (
    <div className="flex justify-center items-center w-screen h-screen m-0 bg-[#3A0CA3] bg-cover bg-center bg-[url('/Background_Resultat.png')]">
      <div className="flex flex-col justify-center items-center h-[100%] w-[100%] gap-[40px] max-w-[1600px]">
        {/* -------------------------------------------------- part 1 (content of player ) ----------------------- */}

        <div className="flex flex-row justify-around items-center w-[100%] h-[85%]">
          {/* -------------------------------------------------- part 1 - 1 (state player 1 ) ----------------------- */}

          <div className="flex flex-col gap-[20px] justify-around align-center flex-grow-1 w-[450px] pt-[40px] h-[100%]">
            <div className="flex flex-col justify-center items-center">
              <img
                className="rounded-[50%] w-[80%] h-[100%] shadow-[30px]"
                src={data.playerData?.profile_image}
                alt="profile img"
              />
              <img
                className="absolute w-[360px] pt-[300px]"
                src="/result_badge.png"
                alt=""
              />
              <span className="absolute text-black font-alexandria font-extrabold text-[25px] pt-[240px]">{data.playerData?.username}</span>
              <span className="absolute text-black font-alexandria font-extrabold text-[25px] pt-[370px]">Level {data.playerData?.level}</span>
            </div>
            <div className="text-center text-[60px] text-green-500 font-luckiest">
              <span>
                +300 <br /> POINTS
              </span>
            </div>
          </div>

          {/* -------------------------------------------------- part 1 - 1 (states Game ) ----------------------- */}

          <div className="flex flex-col pb-[90px] gap-[20px] text-center justify-around align-center flex-grow-1 w-[450px] h-[100%]">
            <img className="" src="/Versus.png" alt="" />
            <div className="text-center text-[120px] text-nowrap text-white font-luckiest">
              {/* <span>{data.playerData?.username === game_players?.side.up.username && game_players?.score.player1 === 3 ? "YOU WIN" : "YOU LOSE"}</span> */}
            </div>
            <div className="text-center text-[120px] text-nowrap text-white font-luckiest">
              {/* <span>{game_players?.score.player1} - {game_players?.score.player2}</span> */}
            </div>
          </div>

          {/* -------------------------------------------------- part 1 - 1 (state player2 ) ----------------------- */}

          <div className="flex flex-col gap-[20px] justify-around align-center flex-grow-1 w-[450px] pt-[40px] h-[100%]">
            <div className="flex flex-col justify-center items-center">
              <img
                className="rounded-[50%] w-[80%] h-[100%]"
                src={data.playerData?.profile_image}
                alt=""
              />
              <img
                className="absolute w-[360px] pt-[300px]"
                src="/result_badge.png"
                alt=""
              />
              {/* <span className="absolute text-black font-alexandria font-extrabold text-[25px] pt-[240px]">{game_players.side?.down}</span> */}
              <span className="absolute text-black font-alexandria font-extrabold text-[25px] pt-[370px]">Level {data.playerData?.level}324</span>
            </div>
            <div className="text-center text-[60px] text-red-600 font-luckiest ">
              <span>
                +0
                <br />
                POINTS
              </span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- part 2 (button_home) ----------------------- */}
        <div className="self-start pl-[10%]">
          <button
            onClick={navig_to_home}
            className="flex justify-center items-center bg-[#4895EF] w-[400px] h-[60px] rounded-[50px]"
          >
            <span className="font-alexandria text-xl"> Back to Home </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default End_of_Game;
