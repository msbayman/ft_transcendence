import "./Play_Page.css";
import EmblaCarousel from "./EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Options from "./Options";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import if using react-router
import { NextButton } from "./Buttons";
import classes from "./style.module.css";
import Cookies from "js-cookie";
import axios from "axios";

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
  { mapPath: "2v2.png", id: 1, mapName: "2v2" },
  { mapPath: "vsBot.png", id: 2, mapName: "vsBot" },
  { mapPath: "Tourn.png", id: 3, mapName: "Tournement" },
];

const SLIDECUES = [
  {
    mapPath: "skins-svg/Paddel/BluePool-Cue.svg",
    id: 0,
    mapName: "BluePool-Cue",
  },
  {
    mapPath: "skins-svg/Paddel/GreenNeonCue.svg",
    id: 1,
    mapName: "GreenNeonCue",
  },
  {
    mapPath: "skins-svg/Paddel/PinkNeonCue.svg",
    id: 2,
    mapName: "PinkNeonCue",
  },
  {
    mapPath: "skins-svg/Paddel/BrownPool-Cue.svg",
    id: 3,
    mapName: "BrownPool-Cue",
  },
];

const SLIDEBALLS = [
  { mapPath: "skins-png/Balls/8BallPool.png"  , id: 0, mapName: "8BallPool", },
  { mapPath: "skins-png/Balls/Foot-Ball.png"  , id: 1, mapName: "FootBall", },
  { mapPath: "skins-png/Balls/Basket-Ball.png", id: 2, mapName: "BasketBall", },
];

const SLIDEBOARDS = [
  {
    mapPath: "skins-svg/Boards/FootBall.svg",
    id: 0,
    mapName: "FootBall-Board",
  },
  {
    mapPath: "skins-svg/Boards/BlueBoard.svg",
    id: 1,
    mapName: "BlueBoard-Board",
  },
  {
    mapPath: "skins-svg/Boards/GreenBoard.svg",
    id: 2,
    mapName: "GreenBoard-Board",
  },
  {
    mapPath: "skins-svg/Boards/BrownBoard.svg",
    id: 3,
    mapName: "brownBoard"
  },
];

const Play_Page: React.FC = () => {
  const navigate = useNavigate(); // If using react-router for navigation
  const [value, setValue] = useState("Modes");
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
          "http://127.0.0.1:8000/user_auth/UserDetailView",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPlayerData({ ...player_data, [name]: value });
  };

  const handleNextClick = () => {
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
    if (currentSlideIndex !== 0) {
        setCurrentSlideIndex(0);
    }
  } , []);
  const handleSelect = () => {
    switch (value) {
      case "Modes":
        setSelectedIds((prev) => ({
          ...prev,
          mode: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            mode: [currentSlideIndex], // Only keep the currentSlideIndex
          },
        }));
        break;
      case "Boards":
        setSelectedIds((prev) => ({
          ...prev,
          board: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            board: [currentSlideIndex], // Only keep the currentSlideIndex
          },
        }));
        break;
      case "Paddles":
        setSelectedIds((prev) => ({
          ...prev,
          paddel: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            paddel: [currentSlideIndex], // Only keep the currentSlideIndex
          },
        }));
        break;
      case "Ball":
        setSelectedIds((prev) => ({
          ...prev,
          ball: currentSlideIndex,
          selectedStatus: {
            ...prev.selectedStatus,
            ball: [currentSlideIndex], // Only keep the currentSlideIndex
          },
        }));
        break;
      default:
        break;
    }
    // Update localStorage with the new state
    localStorage.setItem("selectedSkins", JSON.stringify(selectedIds));
  };

  useEffect(() => {
    console.log("------------->>>     selectedIds   --  ", selectedIds);
  } , [selectedIds])

  const handlePlayClick = () => {
    // Navigate to play page with selected skins
    navigate("/game", { state: { selectedIds } });
  };

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="overflow-scroll scrollbar-hide max-w-[1660px] relative flex flex-grow justify-center items-center h-full md:m-10 m-0  rounded-3xl ">
        <Options value={value} /> {/* Options component value={value}  */}
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
              <div className="absolute top-[10%] flex flex-col justify-center items-center gap-16">
                <div className="w-full">
                  {SLIDEIMAPS[selectedIds.mode!]?.mapName === "Tournement" ? (
                    <div className="flex flex-row-reverse gap-20 justify-center items-center">
                      <div className="flex flex-col items-center justify-evenly">
                        <label className="w-[15rem] text-[20px] relative top-[1rem] left-[1rem] font-alexandria text-white ">
                          Set Your Nickname
                        </label>
                        <input
                          type="text"
                          name="username"
                          placeholder={player_data?.username || ""}
                          onChange={handleInputChange}
                          className="w-[375px] h-[68px] font-alexandria justify-center items-center text-center rounded-[11px] px-3 bg-[#3a0ca3]  text-white text-[32px] m-7"
                          style={{ border: "2px solid #8151EE" }}
                        />
                        <button className="w-[230px] h-[59px] font-alexandria font-medium text-white shadow-md rounded-[36.5px] bg-[#8151EE] flex justify-center items-center text-[30px]">
                          OK
                        </button>
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
                      className="relative flex justify-center items-center right-[1rem] w-full h-[22rem] object-contain"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-10">
                  <img
                    src={SLIDEBOARDS[selectedIds.board!]?.mapPath}
                    alt={SLIDEBOARDS[selectedIds.board!]?.mapName}
                    className="w-full h-[12rem] object-contain"
                  />

                  <img
                    src={SLIDECUES[selectedIds.paddel!]?.mapPath}
                    alt={SLIDEBOARDS[selectedIds.paddel!]?.mapName}
                    className="w-full h-[12rem] object-contain"
                  />

                  <img
                    src={SLIDEBALLS[selectedIds.ball!]?.mapPath}
                    alt={SLIDEBALLS[selectedIds.ball!]?.mapName}
                    className="w-full h-[12rem] object-contain"
                  />
                </div>
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
                <button
                  className="rounded-full border text-[#3A0CA3] bg-white hover:bg-[#3A0CA3] hover:text-white transition-all duration-400 group"
                  onClick={() => {
                    setCurrentSlideIndex(0)
                    handleNextClick()
                  }}
                  disabled={
                    isCurrentSlideSelected() || isOneOfSlidesSelected()
                      ? false
                      : true
                  }
                >
                  <NextButton />
                  <span className="hidden opacity-0 absolute transform  bg-black text-white px-2.5 py-1 rounded whitespace-nowrap transition-opacity duration-200 group-hover:block group-hover:opacity-100">
                    NEXT
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Play_Page;
