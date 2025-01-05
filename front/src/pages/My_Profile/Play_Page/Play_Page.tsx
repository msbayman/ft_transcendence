// import React from 'react'
import "./Play_Page.css";
// import EmblaCarousel from "./EmblaCarousel/EmblaCarousel";
// import { EmblaOptionsType } from "embla-carousel";
import Options from "./Options";

// const OPTIONS: EmblaOptionsType = { loop: true };

// const SLIDEIMAPS = [
//   { mapPath: "1v1.png", id: 0 },
//   { mapPath: "2v2.png", id: 1 },
//   { mapPath: "vsBot.png", id: 2 },
//   { mapPath: "Tourn.png", id: 3 },
// ];

// const SLIDECUES = [
//   { mapPath: "Cues/bluePoolCue.svg", id: 0 },
//   { mapPath: "Cues/bluePoolCue.svg", id: 1 },
//   { mapPath: "Cues/bluePoolCue.svg", id: 2 },
//   { mapPath: "Cues/bluePoolCue.svg", id: 3 },
// ];

// const SLIDEBALLS = [
//   { mapPath: "Balls/8BallPool.svg", id: 0 },
//   { mapPath: "Balls/FootBall.svg", id: 1 },
//   { mapPath: "Balls/BasketBall.svg", id: 2 },
// ];

// const SLIDEBOARDS = [
//   { mapPath: "boards/blueBoard.svg", id: 0 },
//   { mapPath: "boards/footballBoard.svg", id: 1 },
//   { mapPath: "boards/greenBoard.svg", id: 2 },
// ];

const Play_Page = () => {

  return (
    <main className="overflow-scroll scrollbar-hide min-h-[941px] max-w-[1550px] relative flex justify-center items-center flex-wrap h-auto w-full md:m-10 m-0  rounded-3xl ">
      <Options />
      <div className="absolute flex flex-wrap justify-evenly items-center  h-[90%] bottom-0  w-full  overflow-scroll scrollbar-hide bg-[#3A0CA3] rounded-[6rem] shadow-2xl">
{/* ======================================================= */}
      {/* <EmblaCarousel slidesmaps={SLIDEIMAPS} options={OPTIONS} /> */}
{/* ======================================================= */}
      {/* <EmblaCarousel slidesmaps={SLIDEBOARDS} options={OPTIONS} /> */}
{/* ======================================================= */}
      {/* <EmblaCarousel slidesmaps={SLIDECUES} options={OPTIONS} /> */}
{/* ======================================================= */}
      {/* <EmblaCarousel slidesmaps={SLIDEBALLS} options={OPTIONS} /> */}
{/* ======================================================= */}

      </div>
    </main>
  );
};

export default Play_Page;
