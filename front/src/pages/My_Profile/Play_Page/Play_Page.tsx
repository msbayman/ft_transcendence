import React from "react";
import "./Play_Page.css";
import EmblaCarousel from "./EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Options from "./Options";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import if using react-router

interface SelectedIds {
  mode: number | null;
  board: number | null;
  paddel: number | null;
  ball: number | null;
}

const OPTIONS: EmblaOptionsType = { loop: true };

const SLIDEIMAPS = [
  { mapPath: "1v1.png", id: 0 },
  { mapPath: "2v2.png", id: 1 },
  { mapPath: "vsBot.png", id: 2 },
  { mapPath: "Tourn.png", id: 3 },
];

const SLIDECUES = [
  { mapPath: "Cues/bluePoolCue.svg", id: 0 },
  { mapPath: "Cues/brownPoolCue.svg", id: 1 },
  { mapPath: "Cues/greenNeonCue.svg", id: 2 },
  { mapPath: "Cues/pinkNeonCue.svg", id: 3 },
];

const SLIDEBALLS = [
  { mapPath: "Balls/8BallPool.svg", id: 0 },
  { mapPath: "Balls/FootBall.svg", id: 1 },
  { mapPath: "Balls/BasketBall.svg", id: 2 },
];

const SLIDEBOARDS = [
  { mapPath: "boards/blueBoard.svg", id: 0 },
  { mapPath: "boards/footballBoard.svg", id: 1 },
  { mapPath: "boards/greenBoard.svg", id: 2 },
];

const Play_Page: React.FC = () => {
  const navigate = useNavigate(); // If using react-router
  const [value, setValue] = useState("Modes");
  const [selectedIds, setSelectedIds] = useState<SelectedIds>({
    mode: null,
    board: null,
    paddel: null,
    ball: null,
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handlePrevClick = () => {
    switch (value) {
      case "Modes":
        setValue("");
        break;
      case "Boards":
        setValue("Modes");
        break;
      case "Paddels":
        setValue("Boards");
        break;
      case "Ball":
        setValue("Paddels");
        break;
      case "Finish":
        setValue("Ball");
        break;
      default:
        setValue("Modes");
        break;
    }
  };

  const handleNextClick = () => {
    switch (value) {
      case "Modes":
        setValue("Boards");
        break;
      case "Boards":
        setValue("Paddels");
        break;
      case "Paddels":
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
        setSelectedIds((prev) => ({ ...prev, mode: currentSlideIndex }));
        break;
      case "Boards":
        setSelectedIds((prev) => ({ ...prev, board: currentSlideIndex }));
        break;
      case "Paddels":
        setSelectedIds((prev) => ({ ...prev, paddel: currentSlideIndex }));
        break;
      case "Ball":
        setSelectedIds((prev) => ({ ...prev, ball: currentSlideIndex }));
        break;
    }
    // Save to localStorage
    localStorage.setItem("selectedSkins", JSON.stringify(selectedIds));
  };

  let bool: boolean = value === "Modes";

  const handlePlayClick = () => {
    // Navigate to play page with selected skins
    navigate("/game", { state: { selectedIds } });
  };

  return (
    <main className="overflow-scroll scrollbar-hide min-h-[941px] max-w-[1550px] relative flex justify-center items-center flex-wrap h-auto w-full md:m-10 m-0  rounded-3xl ">
      <Options />
      <div className="absolute flex flex-wrap justify-evenly items-center  h-[90%] bottom-0  w-full  overflow-scroll scrollbar-hide bg-[#3A0CA3] rounded-[6rem] shadow-2xl">
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
        {value === "Paddels" && (
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
          <div className="grid grid-flow-row  gap-4">
            <img
              src={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
              alt={SLIDEIMAPS[selectedIds.mode!]?.mapPath}
            />
            <img
              src={SLIDEBOARDS[selectedIds.board!]?.mapPath}
              alt={SLIDEBOARDS[selectedIds.board!]?.mapPath}
            />
            <img
              src={SLIDECUES[selectedIds.paddel!]?.mapPath}
              alt={SLIDECUES[selectedIds.paddel!]?.mapPath}
            />
            <img
              src={SLIDEBALLS[selectedIds.ball!]?.mapPath}
              alt={SLIDEBALLS[selectedIds.ball!]?.mapPath}
            />
          </div>
        )}

        {value === "Modes" ? (
          <></>
        ) : (
          <button
            className="bg-yellow-500 px-4 py-2 rounded-lg text-white"
            onClick={handlePrevClick}
            disabled={bool}
          >
            &laquo; Back
          </button>
        )}

        {value !== "Finish" && (
          <button
            className="bg-green-600 px-4 py-2 rounded-lg text-white"
            onClick={handleSelect}
          >
            Select
          </button>
        )}

        <button
          className="bg-yellow-500 px-4 py-2 rounded-lg text-white"
          onClick={value !== "Finish" ? handleNextClick : handlePlayClick}
        >
          {value === "Finish" ? "Play" : "Next"} &raquo;
        </button>
      </div>
    </main>
  );
};

export default Play_Page;
