import { useEffect, useState } from 'react';

function Rps_game() {
  const [userChoice, setUserChoice] = useState('');
  const [score, setScore] = useState(0);
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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
      setScore(prevScore => prevScore + 1);
    } else {
      setResult('lose');
      setScore(prevScore => prevScore - 1);
    }
  };

  const handleUserChoice = (choice: string) => {
    if (isPlaying) return; // Prevent multiple clicks while animation is playing
    
    setIsPlaying(true);
    setUserChoice(choice);
    
    // Reset previous result and computer choice
    setResult('');
    setComputerChoice('');

    // Simulate computer thinking time
    setTimeout(() => {
      generateComputerChoice(choice);
      setIsPlaying(false);
    }, 1000);
  };

  const choice1 = 'z-0 transition-all duration-200 hover:scale-125 cursor-pointer';

  return (
    <div className="bg-[url(background.svg)] bg-cover bg-center h-screen w-full flex justify-center items-center">
      <div className="z-50 flex justify-start items-center">
        <h2 
          className={
            result ? 
            "text-white absolute font-luckiest text-6xl rounded-md" : 
            "hidden"
          }
        >
          {result === "win" && "YOU WIN - CONGRATULATIONS"}
          {result === "lose" && "YOU LOSE - GAME OVER"}
          {result === "draw" && "DRAW PLAY AGAIN"}
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
              onClick={() => handleUserChoice("rock")}
            />
          </div>

          <div className="relative top-7">
            <img
              className={`${choice1} ${isPlaying ? 'pointer-events-none opacity-50' : ''}`}
              src="RPS/Paper.svg"
              alt="PAPER"
              onClick={() => handleUserChoice("paper")}
            />
          </div>

          <div className="relative top-7">
            <img
              className={`${choice1} ${isPlaying ? 'pointer-events-none opacity-50' : ''}`}
              src="RPS/Scissors.svg"
              alt="SCISSORS"
              onClick={() => handleUserChoice("scissor")}
            />
          </div>
        </div>
      </div>

      <div className="absolute">
        <div className="flex flex-row">
          {computerChoice && (
            <img 
              src={`Tools/L-${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}.svg`} 
              alt={computerChoice.toUpperCase()} 
            />
          )}
          {userChoice && (
            <img 
              src={`Tools/R-${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}.svg`} 
              alt={userChoice.toUpperCase()} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Rps_game;