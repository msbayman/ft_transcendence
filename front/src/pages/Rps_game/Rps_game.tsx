import { useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom"


function Rps_game() {
  const [userChoice, setUserChoice] = useState('');
  // const [score, setScore] = useState(0);
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUserWaiting, setShowUserWaiting] = useState(false);
  const [showComputerWaiting, setShowComputerWaiting] = useState(false);
  const [winner, setWinner] = useState(false);

  const generateComputerChoice = (currentUserChoice: string) => {
    const choices = ['rock', 'paper', 'scissor'];
    const randomChoice = choices[Math.floor(Math.random() * 3)];
    setComputerChoice(randomChoice);
    checkResult(currentUserChoice, randomChoice);

  };

  const checkResult = (userChoice: string, computerChoice: string) => {
    if (userChoice === computerChoice) {
      setResult('draw');
    } else if (
      (userChoice === 'rock' && computerChoice === 'scissor') ||
      (userChoice === 'paper' && computerChoice === 'rock') ||
      (userChoice === 'scissor' && computerChoice === 'paper')
    ) {
      setResult('win');
      // setScore(prevScore => prevScore + 1);
      setWinner(true);
    } else {
      setResult('lose');
      // setScore(prevScore => prevScore - 1);
      setWinner(true);
    }
  };

  const handleUserChoice = (choice: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setUserChoice(choice);
    setResult('');
    setComputerChoice('');

    // Show computer "thinking" animation
    setShowComputerWaiting(true);

    // Simulate computer thinking time
    setTimeout(() => {
      setShowComputerWaiting(false);
      generateComputerChoice(choice);
      setIsPlaying(false);
    }, 2000);
  };

  const WaitingDots = () => (
    <div className="flex flex-row gap-3">
      <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.7s]"></div>
    </div>
  );

  const choice1 = 'z-0 transition-all duration-200 hover:scale-125 cursor-pointer';

  const navigate = useNavigate();

  useEffect(() => {
    if (winner)
      setTimeout(() => {
        navigate("/Overview");
      }, 2000);
  }, [winner]);

  return (
    <div className="bg-[url(background.svg)] bg-cover bg-center h-screen w-full flex justify-center items-center">
      <div className="z-50 flex justify-start items-center">
        <h2
          className={
            result ?
              "text-white absolute top-96 font-luckiest text-6xl rounded-md" :
              "hidden"
          }
        >
          {result === "win" && "YOU WIN"}
          {result === "lose" && "YOU LOSE"}
          {result === "draw" && "AGAIN"}
        </h2>
      </div>

      <div className="flex justify-center items-center">
        <div className="absolute">
          <img src="table2.svg" alt="table" />
        </div>

        <div className="absolute bottom-[28rem]">
          <img src="bg-picture.svg" alt="background" />
        </div>

        <div className="flex items-end justify-center gap-[4rem] relative left-5 top-[15rem]">
          <div className="relative">
            <img
              className={`${choice1} ${isPlaying ? 'pointer-events-none opacity-50' : ''}`}
              src="RPS/Rock.svg"
              alt="ROCK"
              onClick={() => {
                setWinner(false);
                handleUserChoice("rock")
              }}
            />
          </div>

          <div className="relative top-7">
            <img
              className={`${choice1} ${isPlaying ? 'pointer-events-none opacity-50' : ''}`}
              src="RPS/Paper.svg"
              alt="PAPER"
              onClick={() => {
                setWinner(false);
                handleUserChoice("paper")
              }}
            />
          </div>

          <div className="relative top-7">
            <img
              className={`${choice1} ${isPlaying ? 'pointer-events-none opacity-50' : ''}`}
              src="RPS/Scissors.svg"
              alt="SCISSORS"
              onClick={() => {
                setWinner(false);
                handleUserChoice("scissor")
              }}
            />
          </div>
        </div>
      </div>

      <div className={!winner ? "absolute" : "absolute blur-md"}>
        <div className="flex flex-row items-center justify-evenly">
          {/* Computer side */}
          <div className="flex flex-col items-center gap-4">
            {showComputerWaiting ? (
              <WaitingDots />
            ) : (
              computerChoice && (
                <img
                  src={`Tools/L-${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}.svg`}
                  alt={computerChoice.toUpperCase()}
                />
              )
            )}
          </div>

          {/* User side */}
          <div className="flex flex-col items-center gap-4">
            {showUserWaiting ? (
              <WaitingDots />
            ) : (
              userChoice && (
                <img
                  src={`Tools/R-${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}.svg`}
                  alt={userChoice.toUpperCase()}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rps_game;