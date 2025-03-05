import { useEffect, useState } from 'react';
import { config } from "../../config";
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";

interface GamePropsInterface {
  id: string;
}

function Rps_game({ id }: GamePropsInterface) {
  const [userChoice, setUserChoice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const [result, setResult] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const { WS_HOST_URL } = config;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    const ws = new WebSocket(`${WS_HOST_URL}/ws/rsp/${id}/?token=${token}`);
    
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up on component unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [WS_HOST_URL, id, navigate]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);

        // Handle different message types
        if (data.type === "error") {
          console.error("Error:", data.message);
          return;
        }

        if (data.type === "game_end") {
          handleGameEnd(data.game_state);
          navigate('/Overview')
          return;
        }

        // Regular game state update
        handleGameState(data);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };
  }, [socket]);

  // Handle game state updates
  const handleGameState = (gameState: any) => {
    // Update scores if available
    if (gameState.score) {
      setScore(gameState.score);
    }

    // Check for round result based on choices
    if (gameState.up_choise && gameState.down_choise) {
      setOpponentChoice(gameState.down_choise); // Assuming player is always 'up'
      setWaitingForOpponent(false);
      
      // Determine round result
      if (gameState.winner) {
        const isPlayerWinner = gameState.winner === Cookies.get("username");
        setResult(isPlayerWinner ? "win" : "lose");
      } else if (gameState.up_choise === gameState.down_choise) {
        setResult("draw");
      }
      
      setIsPlaying(false);
    }
  };

  // Handle game end
  const handleGameEnd = (gameState: any) => {
    setGameOver(true);
    setScore(gameState.score);
    
    const isPlayerWinner = gameState.winner === Cookies.get("username");
    setResult(isPlayerWinner ? "win" : "lose");
    
    // Redirect after game end
    setTimeout(() => {
      navigate("/Overview");
    }, 3000);
  };

  // Send player's choice to the server
  const handleUserChoice = (choice: string) => {
    if (isPlaying || !socket || socket.readyState !== WebSocket.OPEN) return;

    setIsPlaying(true);
    setWaitingForOpponent(true);
    setUserChoice(choice);
    setResult('');
    
    // Send choice to server
    socket.send(JSON.stringify({ "choise": choice }));
  };

  // Waiting animation component
  const WaitingDots = () => (
    <div className="flex flex-row gap-3">
      <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
      <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.7s]"></div>
    </div>
  );

  const choice1 = 'z-0 transition-all duration-200 hover:scale-125 cursor-pointer';

  return (
    <div className="bg-[url(background.svg)] bg-cover bg-center h-screen w-full flex justify-center items-center">
      {/* Score display */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg flex gap-8">
          <div>You: {score.p1}</div>
          <div>Opponent: {score.p2}</div>
        </div>
      </div>

      {/* Result message */}
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
          {result === "draw" && "DRAW"}
        </h2>
      </div>

      <div className="flex justify-center items-center">
        <div className="absolute">
          <img src="table2.svg" alt="table" />
        </div>

        <div className="absolute bottom-[28rem]">
          <img src="bg-picture.svg" alt="background" />
        </div>

        {/* Player's choices */}
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

      {/* Game display area */}
      <div className={!gameOver ? "absolute" : "absolute blur-md"}>
        <div className="flex flex-row items-center justify-evenly gap-16">
          {/* Opponent side */}
          <div className="flex flex-col items-center gap-4">
            {waitingForOpponent ? (
              <WaitingDots />
            ) : (
              opponentChoice && (
                <img
                  src={`Tools/L-${opponentChoice.charAt(0).toUpperCase() + opponentChoice.slice(1)}.svg`}
                  alt={opponentChoice.toUpperCase()}
                />
              )
            )}
          </div>

          {/* User side */}
          <div className="flex flex-col items-center gap-4">
            {userChoice && (
              <img
                src={`Tools/R-${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}.svg`}
                alt={userChoice.toUpperCase()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rps_game;