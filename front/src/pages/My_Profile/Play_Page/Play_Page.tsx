
import "./Play_Page.css";
import EmblaCarousel from "./EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Options from "./Options";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NextButton } from "./Buttons";
import classes from "./style.module.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { TournContext } from "./../../Game_Page/TournContext";
import { config } from "../../../config";
interface SelectedIds {
  mode: number | null;
  board: number | null;
  paddel: number | null;
  ball: number | null;
  selectedStatus: {
    mode: number[];
    board: number[];
    paddel: number[];
    ball: number[];
  };
}
const OPTIONS: EmblaOptionsType = { loop: true };

const SLIDEIMAPS = [
  { mapPath: "1v1.png", id: 0, mapName: "1v1" },
  { mapPath: "/local_custom.svg", id: 1, mapName: "local" },
  { mapPath: "Tourn.png", id: 2, mapName: "Tournement" },
  { mapPath: "RPS-Game.png", id: 3, mapName: "RPS" },
];

const SLIDECUES = [
  {
    mapPath: "Paddles/Cyan-Paddle.svg",
    id: 0,
    mapName: "Cyan-Paddle",
  },
  {
    mapPath: "Paddles/Green-Paddle.svg",
    id: 1,
    mapName: "Green-Paddle",
  },
  {
    mapPath: "Paddles/N-Blossom-Paddle.svg",
    id: 2,
    mapName: "N-Blossom-Paddles",
  },
  {
    mapPath: "Paddles/Violet-Paddle.svg",
    id: 3,
    mapName: "Violet-Paddles",
  },
];

const SLIDEBALLS = [
  { mapPath: "Balls/pink-ball.svg", id: 0, mapName: "pinkBall" },
  { mapPath: "Balls/green-ball.svg", id: 1, mapName: "greenBall" },
  { mapPath: "Balls/cyan-ball.svg", id: 2, mapName: "cyanBall" },
  { mapPath: "Balls/violet-ball.svg", id: 3, mapName: "violetBall" },
];

const SLIDEBOARDS = [
  {
    mapPath: "skins-svg/Boards/BlueBoard.svg",
    id: 0,
    mapName: "BlueBoard-Board",
  },
  {
    mapPath: "skins-svg/Boards/GreenBoard.svg",
    id: 1,
    mapName: "GreenBoard-Board",
  },
  {
    mapPath: "skins-svg/Boards/BrownBoard.svg",
    id: 2,
    mapName: "brownBoard",
  },
];

const Play_Page: React.FC = () => {
  const location = useLocation();
  const challenge = location.state?.challenge;
  const navigate = useNavigate();
  const [value, setValue] = useState("Modes");
  const [tourninput1, settourninput1] = useState("");
  const [tourninput2, settourninput2] = useState("");
  const [tourninput3, settourninput3] = useState("");
  const [tourninput4, settourninput4] = useState("");
  const { setSelectedId } = useContext(TournContext);
  const { HOST_URL } = config;
  const { tournamentState, setTournamentState } = useContext(TournContext);
  const [selectedIds, setSelectedIds] = useState<SelectedIds>({
    mode: null,
    board: null,
    paddel: null,
    ball: null,
    selectedStatus: {
      mode: [],
      board: [],
      paddel: [],
      ball: [],
    },
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handletourChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    settourninput1(e.target.value);
  };
  const handletourChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    settourninput2(e.target.value);
  };
  const handletourChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    settourninput3(e.target.value);
  };
  const handletourChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    settourninput4(e.target.value);
  };

  const isOneOfSlidesSelected = () => {
    switch (value) {
      case "Modes":
        return selectedIds.selectedStatus.mode.length > 0;
      case "Boards":
        return selectedIds.selectedStatus.board.length > 0;
      case "Paddles":
        return selectedIds.selectedStatus.paddel.length > 0;
      case "Ball":
        return selectedIds.selectedStatus.ball.length > 0;
      default:
        return false;
    }
  };

  const isCurrentSlideSelected = () => {
    switch (value) {
      case "Modes":
        return selectedIds.selectedStatus.mode.includes(currentSlideIndex);
      case "Boards":
        return selectedIds.selectedStatus.board.includes(currentSlideIndex);
      case "Paddles":
        return selectedIds.selectedStatus.paddel.includes(currentSlideIndex);
      case "Ball":
        return selectedIds.selectedStatus.ball.includes(currentSlideIndex);
      default:
        return false;
    }
  };

  interface player_data {
    username: string;
  }
  const [player_data, setPlayerData] = useState<player_data>({
    username: "",
  });

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const token = Cookies.get("access_token"); // Ensure token is available
        if (!token) throw new Error("No access token found. Please log in.");

        const response = await axios.get<player_data>(
          `${HOST_URL}/api/user_auth/UserDetailView`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlayerData(response.data);
      } catch (error) {
        console.error("Failed to fetch player data:", error);
      }
    };

    fetchPlayerData();
  }, []);

  const handleNextClick = () => {

    if (selectedIds.mode === 3) {
      setValue("Finish");
      return;
    }

    switch (value) {
      case "Modes":
        setValue("Boards");
        break;
      case "Boards":
        setValue("Paddles");
        break;
      case "Paddles":
        setValue("Ball");
        break;
      case "Ball":
        setValue("Finish");
        break;
      case "Finish":
        setValue("");
        // Navigate to play page with selected skins

        navigate("/game", { state: { selectedIds } });

        break;
      default:
        setValue("Modes");
        break;
    }
  };

  useEffect(() => {
    if (challenge) {
      // Set the board to "Board" when challenge is true
      setValue("Boards");

      // Update selectedIds state
      setSelectedIds((prev) => ({
        ...prev,
        mode: currentSlideIndex,
        selectedStatus: {
          ...prev.selectedStatus,
          mode: [currentSlideIndex], // Only keep the currentSlideIndex
        },
      }));
    }
  }, []);

  const handleSelect = () => {
    switch (value) {
      case "Modes":
        setSelectedIds((prev) => ({
          ...prev,
          mode: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            mode: [currentSlideIndex],
          },
        }));
        break;
      case "Boards":
        setSelectedIds((prev) => ({
          ...prev,
          board: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            board: [currentSlideIndex],
          },
        }));
        break;
      case "Paddles":
        setSelectedIds((prev) => ({
          ...prev,
          paddel: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            paddel: [currentSlideIndex],
          },
        }));
        break;
      case "Ball":
        setSelectedIds((prev) => ({
          ...prev,
          ball: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            ball: [currentSlideIndex],
          },
        }));
        break;
      default:
        break;
    }
    // Update localStorage with the new state
    localStorage.setItem("selectedSkins", JSON.stringify(selectedIds));
  };

  const handlePlayClick = () => {
    if (SLIDEIMAPS[selectedIds.mode!]?.mapName === "RPS")
      navigate("/rps_game");
    if (SLIDEIMAPS[selectedIds.mode!]?.mapName === "1v1")
      navigate("/remote_game", { state: { selectedIds } });
    if (SLIDEIMAPS[selectedIds.mode!]?.mapName === "local")
      navigate("/local_game", { state: { selectedIds } });
    if (SLIDEIMAPS[selectedIds.mode!]?.mapName === "Tournement") {
      setSelectedId((prev) => ({
        ...prev,
        mod: null,
        board: selectedIds.board,
        paddel: selectedIds.paddel,
        ball: selectedIds.ball,
      }));
      navigate("/tourn");
    }
  };

  return (
    <main className="w-full h-full flex justify-center items-center min-w-[1000px]">
      <div className="overflow-scroll scrollbar-hide max-w-[1660px] relative flex flex-grow justify-center items-center h-full rounded-3xl ">
        <Options value={value} />
        <div className="absolute flex flex-col flex-wrap justify-evenly items-center h-[90%] bottom-0  w-full  overflow-scroll scrollbar-hide bg-[#3A0CA3] rounded-[6rem] shadow-lg">
          <div className=" flex-1 h-full  flex flex-col justify-center items-center">
            {value === "Modes" && (
              <EmblaCarousel
                slidesmaps={SLIDEIMAPS}
                options={OPTIONS}
                setCurrentSlideIndex={setCurrentSlideIndex}
              />
            )}
            {value === "Boards" && (
              <EmblaCarousel
                slidesmaps={SLIDEBOARDS}
                options={OPTIONS}
                setCurrentSlideIndex={setCurrentSlideIndex}
              />
            )}
            {value === "Paddles" && (
              <EmblaCarousel
                slidesmaps={SLIDECUES}
                options={OPTIONS}
                setCurrentSlideIndex={setCurrentSlideIndex}
              />
            )}
            {value === "Ball" && (
              <EmblaCarousel
                slidesmaps={SLIDEBALLS}
                options={OPTIONS}
                setCurrentSlideIndex={setCurrentSlideIndex}
              />
            )}
            {value === "Finish" && (
              <div className="absolute top-[10%] flex flex-col justify-center items-center gap-12">
                <div className="w-[100%] h-[30rem]">
                  {SLIDEIMAPS[selectedIds.mode!]?.mapName === "Tournement" ? (
                    <div className="relative flex flex-row-reverse gap-0 justify-center items-center  ">
                      <div className="flex flex-col items-center justify-center w-[800px] relative">
                        <label className="w-[15rem] text-[30px] relative bottom-[5px] left-[1rem] font-alexandria text-white ">
                          Set Nicknames :
                        </label>
                        <div className="flex flex-row  min-w-[99rem] items-center justify-center">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex flex-col items-center justify-center">
                              <input
                                type="text"
                                name="username"
                                id="1"
                                placeholder="Player 1"
                                value={tourninput1}
                                onChange={handletourChange1}
                                className="w-[350px] h-[68px] font-alexandria justify-center items-center text-center rounded-[11px] px-3 bg-[#3a0ca3] text-white text-[32px] m-7"
                                style={{ border: "2px solid #8151EE" }}
                              />
                              <button
                                onClick={() =>
                                  setTournamentState({
                                    ...tournamentState,
                                    p1: tourninput1,
                                  })
                                }
                                className="relative bottom-2 w-[180px] h-[39px] font-alexandria text-white shadow-md rounded-[36.5px] bg-[#8151EE] flex justify-center items-center text-[16px] hover:bg-white hover:text-[#3a0ca3]"
                              >
                                DONE
                              </button>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <input
                                type="text"
                                name="username"
                                id="2"
                                placeholder="Player 2"
                                value={tourninput2}
                                onChange={handletourChange2}
                                className="w-[350px] h-[68px] font-alexandria justify-center items-center text-center rounded-[11px] px-3 bg-[#3a0ca3] text-white text-[32px] m-7"
                                style={{ border: "2px solid #8151EE" }}
                              />
                              <button
                                onClick={() =>
                                  setTournamentState({
                                    ...tournamentState,
                                    p2: tourninput2,
                                  })
                                }
                                className="relative bottom-2 w-[180px] h-[39px] font-alexandria text-white shadow-md rounded-[36.5px] bg-[#8151EE] flex justify-center items-center text-[16px] hover:bg-white hover:text-[#3a0ca3]"
                              >
                                DONE
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex flex-col items-center justify-center">
                              <input
                                type="text"
                                name="username"
                                id="3"
                                placeholder="Player 3"
                                value={tourninput3}
                                onChange={handletourChange3}
                                className="w-[350px] h-[68px] font-alexandria justify-center items-center text-center rounded-[11px] px-3 bg-[#3a0ca3] text-white text-[32px] m-7"
                                style={{ border: "2px solid #8151EE" }}
                              />
                              <button
                                onClick={() =>
                                  setTournamentState({
                                    ...tournamentState,
                                    p3: tourninput3,
                                  })
                                }
                                className="relative bottom-2 w-[180px] h-[39px] font-alexandria text-white shadow-md rounded-[36.5px] bg-[#8151EE] flex justify-center items-center text-[16px] hover:bg-white hover:text-[#3a0ca3]"
                              >
                                DONE
                              </button>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <input
                                type="text"
                                name="username"
                                id="4"
                                placeholder="Player 4"
                                value={tourninput4}
                                onChange={handletourChange4}
                                className="w-[350px] h-[68px] font-alexandria justify-center items-center text-center rounded-[11px] px-3 bg-[#3a0ca3] text-white text-[32px] m-7"
                                style={{ border: "2px solid #8151EE" }}
                              />
                              <button
                                onClick={() =>
                                  setTournamentState({
                                    ...tournamentState,
                                    p4: tourninput4,
                                  })
                                }
                                className="relative bottom-2 w-[180px] h-[39px] font-alexandria text-white shadow-md rounded-[36.5px] bg-[#8151EE] flex justify-center items-center text-[16px] hover:bg-white hover:text-[#3a0ca3]"
                              >
                                DONE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <img
                        src={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
                        alt={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
                        className="flex justify-center items-center w-full h-[22rem] object-contain"
                      />
                    </div>
                  ) : (
                    <img
                      src={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
                      alt={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
                      className="relative flex justify-center items-center w-full h-[28rem] object-contain"
                    />
                  )}
                </div>
                {selectedIds.mode !== 3 && (<div className="grid grid-cols-3 place-content-center w-full gap-10 h-[14rem]">
                  <img
                    src={SLIDECUES[selectedIds.paddel!]?.mapPath}
                    alt={SLIDEBOARDS[selectedIds.paddel!]?.mapName}
                    className="relative w-full h-[18rem] object-contain"
                  />

                  <img
                    src={SLIDEBOARDS[selectedIds.board!]?.mapPath}
                    alt={SLIDEBOARDS[selectedIds.board!]?.mapName}
                    className="relative w-full h-[18rem] object-contain top-3"
                  />

                  <img
                    src={SLIDEBALLS[selectedIds.ball!]?.mapPath}
                    alt={SLIDEBALLS[selectedIds.ball!]?.mapName}
                    className="relative w-full h-[18rem] object-contain right-2"
                  />
                </div>)}
                <div className="flex w-full h-full justify-center items-center text-center gap-4">
                  <img
                    className="relative top-2"
                    src="Rectangle.svg"
                    alt="Play"
                  />
                  <h4
                    className="absolute font-luckiest bottom-[-13px] text-[4.8rem] text-shadow-lg text-white cursor-pointer"
                    onClick={handlePlayClick}
                  >
                    PLAY
                  </h4>
                </div>
              </div>
            )}
          </div>
          {value !== "Finish" && (
            <div className="absolute bottom-11 left-10 w-full h-[10%] flex justify-evenly items-center">
              <button style={{ visibility: "visible" }}></button>
              <button
                className={
                  isCurrentSlideSelected() ? classes.selected : classes.select
                }
                onClick={handleSelect}
              >
                {isCurrentSlideSelected() ? "SELECTED" : "SELECT"}
              </button>
              {value !== "Finish" && (
                <div
                  onClick={
                    isOneOfSlidesSelected()
                      ? () => {
                        setCurrentSlideIndex(0);
                        handleNextClick();
                      }
                      : undefined
                  }
                  className={`rounded-full border text-[#3A0CA3] bg-white hover:bg-[#3A0CA3] hover:text-white transition-all duration-400 group ${isOneOfSlidesSelected()
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                    }`}
                >
                  <NextButton />
                  <span className="hidden opacity-0 absolute transform  bg-black text-white px-2.5 py-1 rounded whitespace-nowrap transition-opacity duration-200 group-hover:block group-hover:opacity-100">
                    NEXT
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Play_Page;
