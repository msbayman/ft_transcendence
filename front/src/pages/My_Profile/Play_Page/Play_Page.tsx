import "./Play_Page.css";
import EmblaCarousel from "./EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Options from "./Options";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import if using react-router
import { NextButton } from "./Buttons";
import classes from "./style.module.css";

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
  { mapPath: "skins-png/Balls/8BallPool.png", id: 0, mapName: "8BallPool" },
  { mapPath: "skins-png/Balls/Foot-Ball.png", id: 1, mapName: "FootBall" },
  { mapPath: "skins-png/Balls/Basket-Ball.png", id: 2, mapName: "BasketBall" },
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
  { mapPath: "skins-svg/Boards/FootBall.svg", id: 3, mapName: "-Board" },
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

  const isPreviousSlideSelected = () => {
    switch (value) {
      case "Modes":
        return selectedIds.selectedStatus.mode.includes(currentSlideIndex - 1);
      case "Boards":
        return selectedIds.selectedStatus.board.includes(currentSlideIndex - 1);
      case "Paddles":
        return selectedIds.selectedStatus.paddel.includes(currentSlideIndex - 1);
      case "Ball":
        return selectedIds.selectedStatus.ball.includes(currentSlideIndex - 1);
      default:
        return false;
    }
  }

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
                <img
                  src={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
                  alt={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
                  className="relative flex justify-center items-center right-[1rem] w-full h-[22rem] object-contain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Football Board */}
                <img
                  src={SLIDEBOARDS[selectedIds.board!]?.mapPath}
                  alt="Football Board"
                  className="w-full h-[12rem] object-contain"
                />

                <img
                  src={SLIDECUES[selectedIds.paddel!]?.mapPath}
                  alt="Green Neon Cue"
                  className="w-full h-[12rem] object-contain"
                />

                <img
                  src={SLIDEBALLS[selectedIds.ball!]?.mapPath}
                  alt="Football Ball"
                  className="w-full h-[12rem] object-contain"
                />
              </div>
              <div className="flex w-full h-full justify-center items-center text-center gap-4">
                <img
                  className="relative bottom-2"
                  src="Rectangle.svg"
                  alt="Play"
                />
                <h4
                  className="absolute font-luckiest text-[4.8rem] text-shadow-lg text-white cursor-pointer"
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
                onClick={handleNextClick}
                disabled={(isCurrentSlideSelected() || isPreviousSlideSelected()) ? false : true}
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
