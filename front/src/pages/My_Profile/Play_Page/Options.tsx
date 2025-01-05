import React from 'react'
import { useState } from 'react'


function Options() {
	const [action, setAction] = useState("");
  const [tab, setTab] = useState<boolean>(true);

  const handleTabs = (tab: boolean, string: string) => {
    console.log(string);
    setTab(tab);
    !tab ? setAction(" active") : setAction("");
  };
  return (
	<div className="absolute top-[5%] z-10  w-[70%] h-[10%] bg-[#3A0CA3] rounded-[65px] shadow-2xl flex justify-center gap-16 items-center">
        {/* <div className={`abs${action}`} /> */}
        <div className="w-[13%] h-[100%] flex justify-center items-center">
          <a onClick={() => handleTabs(true, "mode")}>
            <h1 className="text-white text-4xl">MODES</h1>
          </a>
        </div>
        <div className="w-[13%] h-[100%] flex justify-center items-center">
          <a onClick={() => handleTabs(true, "B")}>
            <h1 className="text-white text-4xl">BOARDS</h1>
          </a>
        </div>
        <div className="w-[13%] h-[100%] flex justify-center items-center">
          <a onClick={() => handleTabs(true, "C")}>
            <h1 className="text-white text-4xl">CUES</h1>
          </a>
        </div>
        <div className="w-[13%] h-[100%] flex justify-center items-center">
          <a onClick={() => handleTabs(true, "Ball")}>
            <h1 className="text-white text-4xl">BALLS</h1>
          </a>
        </div>
        <div className="w-[13%] h-[100%] flex justify-center items-center">
          <a onClick={() => handleTabs(true, "F")}>
            <h1 className="text-white text-4xl">FINISH</h1>
          </a>
        </div>
      </div>
  )
}

export default Options