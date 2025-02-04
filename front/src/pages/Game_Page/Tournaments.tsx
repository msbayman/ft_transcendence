import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { TournContext } from './TournContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tournaments = () => {
	const { tournamentState, setTournamentState } = useContext(TournContext);
	const { selectedId } = useContext(TournContext);
  	const navigate = useNavigate();
  	const [time, setTime] = useState(5);

	const handleSleep = async () => {
		await new Promise((resolve) => setTimeout(resolve, 3000));
	  };
	useEffect(() => {
		if (tournamentState.finish && time <= 0) {
			setTournamentState({
				finish: false,
				final: "",
				semi1: "",
				semi2: "",
				p1: "def-1",
				p2: "def-2",
				p3: "def-3",
				p4: "def-4",
			});
			handleSleep();
			goToOver();
			return;
		}
		if (time === 4 && !tournamentState.finish) {
			toast.success("Game gonna start in 3 seconds", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
		if (time <= 0 && !tournamentState.finish) {
			goTogame();
		}
	
		const timer = setInterval(() => {
			setTime((prevTime: number) => prevTime - 1);
		}, 1000);
	
		return () => clearInterval(timer);
	}, [time]);

	const goTogame = () => {
		navigate("/tourn_game", { state: {selectedId} });
	};
	
	const goToOver = () => {
		navigate("/overview");
	};

  return (
	<div className="flex w-screen h-screen justify-center items-center bg-[url('/background.png')] bg-cover bg-center pb-[50px]">
		<ToastContainer />
	  <div className="flex justify-center items-center flex-col w-[100%] max-w-[1600px] h-[100%] gap-[10px]">
		{/* -------------------------------------------------->>> part1 title*/}

		<div className="text-white font-alexandria text-center font-bold text-[100px] p-6 tracking-wider">
		  Tournament
		</div>

		{/* -------------------------------------------------->>> part2 content-players*/}

		<div className="flex flex-col gap-[80px] w-[100%] h-[100%] justify-center items-center max-h-[1100px]">
		  {/* -------------------------------------------------->>> part2 - 1 final */}

		  <div className="relative flex flex-row justify-around items-center rounded-[30px] bg-white w-[400px] max-h-[180px]">
			<div className="flex pl-3 flex-col gap-4 justify-around items-center">
			  <img
				src="/profile.png"
				alt="photo_profile"
				className="w-[100px] rounded-[50%]"
			  />
			  <div className="font-alexandria text-[25px]">
				{tournamentState?.final}
			  </div>
			</div>
			<div className="bg-[#3A0CA3] h-[80%] w-[5px] rounded-3xl"></div>
			<div className="relative flex flex-col justify-around items-center pr-2">
			  <img
				src="/Tournaments/win_tournaments.svg"
				alt="win_tournament"
				className=" w-[110px] pb-4"
			  />
			  <div className=" font-alexandria font-thin text-[25px] pb-7">
				{" "}
				0 Points
			  </div>  
			</div>
		  </div>
		  {/* -------------------------------------------------->>> part2 - 2 qualif_1 ------------------------------------------------------------------*/}
		  <div className="flex flex-row justify-around items-start gap-[30px] w-full">
			<div className="flex flex-col items-center gap-[20px] justify-center h-[100%] w-2/6 ">
			  <div className="flex justify-center items-center h-[280px] w-[40%] bg-white rounded-[40px]">
				<div className="flex flex-col gap-4 justify-around items-center">
				  <img
					src="/profile.png"
					alt="photo_profile"
					className="w-[120px] rounded-[50%] shadow-lg"
				  />
				  <div className="font-alexandria text-[25px]">
					{tournamentState.semi1}
				  </div>
				  <div className="font-alexandria text-[25px] font-extralight">
					Level 0
				  </div>
				</div>
			  </div>

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
				<div className="flex justify-center items-center h-[100%] w-[40%] bg-white rounded-[30px]">
				  <div className="flex flex-col gap-4 justify-around items-center">
					<img
					  src="/profile.png"
					  alt="photo_profile"
					  className="w-[120px] rounded-[50%] shadow-lg"
					/>
					<div className="font-alexandria text-[25px]">
					{tournamentState.p1}
					</div>
					<div className="font-alexandria text-[25px] font-extralight">
					  Level 0
					</div>
				  </div>
				</div>
				<div className="flex justify-center items-center h-[100%] w-[40%] bg-white rounded-[30px]">
				  <div className="flex flex-col gap-4 justify-around items-center">
					<img
					  src="/profile.png"
					  alt="photo_profile"
					  className="w-[120px] rounded-[50%] shadow-lg"
					/>
					<div className="font-alexandria text-[25px]">
						{tournamentState.p2}
					</div>
					<div className="font-alexandria text-[25px] font-extralight">
					  Level 0
					</div>
				  </div>
				</div>
			  </div>
			</div>

			{/* -------------------------------------------------->>> part2 (style horisantal rule) -----------------------------------------------------------*/}
			<div className="flex flex-col justify-center items-center w-[30%] self-start">
			  <div className="h-[150px] w-[5px] bg-white"></div>
			  <div className="h-[5px] w-[150%] bg-white"></div>
			</div>
			{/* -------------------------------------------------->>> part2 - 2 qualif_2 -----------------------------------------------------------*/}
			<div className="flex flex-col items-center gap-[20px] justify-center h-[100%] w-2/6 ">
			  <div className="flex justify-center items-center h-[280px] w-[40%] bg-white rounded-[40px]">
				<div className="flex flex-col gap-4 justify-around items-center">
				  <img
					src="/profile.png"
					alt="photo_profile"
					className="w-[120px] rounded-[50%] shadow-lg"
				  />
				  <div className="font-alexandria text-[25px]">
					{tournamentState.semi2}
				  </div>
				  <div className="font-alexandria text-[25px] font-extralight">
					Level 0
				  </div>
				</div>
			  </div>

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
				<div className="flex justify-center items-center h-[100%] w-[40%] bg-white rounded-[30px]">
				  <div className="flex flex-col gap-4 justify-around items-center">
					<img
					  src="/profile.png"
					  alt="photo_profile"
					  className="w-[120px] rounded-[50%] shadow-lg"
					/>
					<div className="font-alexandria text-[25px]">
					  {tournamentState.p3}
					</div>
					<div className="font-alexandria text-[25px] font-extralight">
					  Level 0
					</div>
				  </div>
				</div>
				<div className="flex justify-center items-center h-[100%] w-[40%] bg-white rounded-[30px]">
				  <div className="flex flex-col gap-4 justify-around items-center">
					<img
					  src="/profile.png"
					  alt="photo_profile"
					  className="w-[120px] rounded-[50%] shadow-lg"
					/>
					<div className="font-alexandria text-[25px]">
					  {tournamentState.p4}
					</div>
					<div className="font-alexandria text-[25px] font-extralight">
					  Level 0
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>

		  {/* -------------------------------------------------->>> part3 button*/}
		   
		</div>
	  </div>	
	</div>
  );
};

export default Tournaments;
