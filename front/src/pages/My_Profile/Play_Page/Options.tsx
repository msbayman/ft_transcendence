function Options() {

  return (
    <div className="absolute top-[5%] z-10  w-[80%] h-[10%] bg-[#3A0CA3] rounded-[65px] shadow-2xl flex justify-evenly gap-10 items-center">

      <h1 className="flex justify-center items-center flex-col-reverse">
        <h4 className="text-white text-2xl font-alexandria">MODES</h4>
        <img src="mode.svg" alt="Modes" className="animate-pulse " />
      </h1>

      <h1 className="flex justify-center items-center flex-col-reverse">
        <h4 className="text-white text-2xl font-alexandria">BOARDS</h4>
        <img src="Board.svg" alt="Modes" className="animate-pulse " />
      </h1>

      <h1 className="flex justify-center items-center flex-col-reverse">
        <h4 className="text-white text-2xl font-alexandria">CUES</h4>
        <img src="cue.svg" alt="Modes" className="animate-pulse " />
      </h1>

      <h1 className="flex justify-center items-center flex-col-reverse">
        <h4 className="text-white text-2xl font-alexandria">BALLS</h4>
        <img src="ball.svg" alt="Modes" className="animate-pulse " />
      </h1>

      <h1 className="flex justify-center items-center flex-col-reverse">
        <h4 className="text-white text-2xl font-alexandria">FINISH</h4>
        <img src="finish.svg" alt="Modes" className="animate-pulse " />
      </h1>

    </div>
  );
}

export default Options;
