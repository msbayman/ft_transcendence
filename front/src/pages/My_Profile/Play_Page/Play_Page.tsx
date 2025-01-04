// import React from 'react'
import "./Play_Page.css";
import EmblaCarousel from "./EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";


const OPTIONS: EmblaOptionsType = { loop: true };

const SLIDEIMAPS = [
  { mapPath: "1v1.svg", id: 0 },
  { mapPath: "2v2.svg", id: 1 },
  { mapPath: "vsBot.svg", id: 2 },
  { mapPath: "Tourn.svg", id: 3 },
];

const Play_Page = () => {
  return (
    <main className="overflow-scroll scrollbar-hide min-h-[941px] relative flex justify-center items-center flex-wrap h-auto w-full md:m-10 m-0  rounded-3xl">
      <div className="absolute top-[5%] z-10  w-[70%] h-[10%] bg-yellow-300 rounded-3xl">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="absolute flex flex-wrap justify-evenly items-center  h-[90%] bottom-0  w-full  overflow-scroll scrollbar-hide bg-slate-500 ">
        <EmblaCarousel
          slidesmaps={SLIDEIMAPS}
          options={OPTIONS}
        />

      </div>
    </main>
  );
};

export default Play_Page;