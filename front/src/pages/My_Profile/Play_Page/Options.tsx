import styles from "./Options.module.css";

interface OptionsProps {
  value: string;
}

function Options({ value }: OptionsProps) {
  return (
    <div className="absolute top-[5%] z-10  w-[80%] h-[10%] bg-[#3A0CA3] rounded-[65px] shadow-2xl flex justify-evenly gap-10 items-center">
      <div className={value === "Modes" ? styles.active : ""}>
        <span className="relative bottom-1 flex justify-evenly items-center gap-10 flex-row-reverse ">
          {value === "Modes" && (
            <h4 className="text-white text-5xl font-alexandria">MODES</h4>
          )}
          <img className="relative bottom-[0.11rem]" src="mode.svg" alt="Modes" />
        </span>
      </div>

      <div className={value === "Boards" ? styles.active : ""}>
        <span className="relative bottom-1 flex justify-evenly items-center gap-10 flex-row-reverse ">
          {value === "Boards" && (
            <h4 className="text-white text-5xl font-alexandria">BOARDS</h4>
          )}
          <img className="relative bottom-[0.11rem]" src="Board.svg" alt="Modes" />
        </span>
      </div>

      <div
        className={
          value === "Paddles"
            ? styles.active
            : "flex items-center justify-evenly"
        }
      >
        <span className="relative bottom-1 flex justify-evenly items-center gap-10 flex-row-reverse ">
          {value === "Paddles" && (
            <h4 className="text-white text-5xl font-alexandria">PADDLES</h4>
          )}
          <img className="relative bottom-[0.11rem]" src="cue.svg" alt="Modes" />
        </span>
      </div>

      <div className={value === "Ball" ? styles.active : ""}>
        <span className="relative bottom-1 flex justify-centre items-center gap-10 flex-row-reverse ">
          {value === "Ball" && (
            <h4 className="text-white text-5xl font-alexandria flex justify-center items-center">
              BALL
            </h4>
          )}
          <img className="relative bottom-[0.11rem]" src="ball.svg" alt="Modes" />
        </span>
      </div>

      <div className={value === "Finish" ? styles.active : ""}>
        <span className="relative bottom-1 flex justify-evenly items-center gap-10 flex-row-reverse ">
          {value === "Finish" && (
            <h4 className="text-white text-5xl font-alexandria">FINISH</h4>
          )}
          <img className="relative bottom-[0.1rem]" src="finish.svg" alt="Modes" />
        </span>
      </div>
    </div>
  );
}

export default Options;
