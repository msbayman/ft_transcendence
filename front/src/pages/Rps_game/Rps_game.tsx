import { useEffect, useState } from 'react';
import { config } from "../../config";
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie";
import { usePlayer } from '../My_Profile/PlayerContext';

interface GamePropsInterface {
  id: string;
}

interface GameState {
  right_choice?: string;  // Changed from right_choice
  left_choice?: string; // Changed from left_choice
  left_player?: string; // Changed from left_choice
  right_player?: string; // Changed from left_choice
  score: { p1: number; p2: number };
  draw: boolean;
  winner?: string | null;
}

function Rps_game({ id }: GamePropsInterface) {
  const PlayerInstance = usePlayer();
  const [userChoice, setUserChoice] = useState<string>('');
  // const [userSide, setUserSide] = useState<string>('');
  const [opponentChoice, setOpponentChoice] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const { WS_HOST_URL } = config;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const navigate = useNavigate();


  const [game_state, setGameState] = useState({
    right_choice: null,
    left_choice: null,
    left_player: null,
    right_player: null,
    score: { p1: 0, p2: 0 },
    draw: false,
    winner: null,
  });


  // Initialize WebSocket connection
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    // Ensure WebSocket URL is properly constructed
    const wsUrl = `${WS_HOST_URL}/ws/rsp/${id}/?token=${encodeURIComponent(token)}`;

    const ws = new WebSocket(wsUrl);


    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Optionally show an error notification to the user
      alert("Connection error. Please try again.");
      navigate('/Overview');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // const gameState: GameState = data.game_state;
        console.log("Received data-", data.type, " :", data);

        // if (PlayerInstance.playerData?.username === data.game_state.left_player)
        // if (data.)

        // Handle different message types
        if (data.type === "error") {
          console.error("Server Error:", data.message);
          alert(data.message || "An error occurred");
          return;
        }
        console.log("Received data-----> :", data.game_state);
        setGameState(() => ({
          right_choice: data.game_state.right_choice,
          left_choice: data.game_state.left_choice,
          left_player: data.game_state.left_player,
          right_player: data.game_state.right_player,
          score: data.game_state.score,
          draw: data.game_state.draw,
          winner: data.game_state.winner
        }));

        if (data.type === "game_end") {
          handleGameEnd(data.game_state);
          return;
        }

        // Regular game state update
        handleGameState(data);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    }

    // Clean up on component unmount


    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log("ana zamel youssef --->  ", game_state.winner);
  }, [game_state])

  // Handle game state updates
  const handleGameState = (gameState: any) => {
    // Extract the actual game state from the message
    const actualGameState = gameState.game_state || gameState;



    // Update scores if available
    if (actualGameState.score) {
      setScore(actualGameState.score);
    }

    // Check for round result based on choices
    if (actualGameState.right_choice && actualGameState.left_choice) {

      setOpponentChoice(PlayerInstance.playerData?.username === actualGameState.left_player ? actualGameState.right_choice : actualGameState.left_choice);
      setWaitingForOpponent(false);

      // Determine round result
      if (actualGameState.draw) {
        setResult("draw");
      }
      setIsPlaying(false);
    }
  };

  // Handle game end
  const handleGameEnd = (gameState: GameState) => {

    setGameOver(true);
    setScore(gameState.score);
    if (gameState.draw) {
      setResult("draw")
    }
    else {
      const username = PlayerInstance.playerData?.username;
      const isPlayerWinner = gameState.winner === username;
      setResult(isPlayerWinner ? "win" : "lose");
    }

    setTimeout(() => {
      // navigate("/Overview");
    }, 3000);
  };


  const handleUserChoice = (choice: string) => {
    if (isPlaying || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const validChoices = ['rock', 'paper', 'scissor'];
    if (!validChoices.includes(choice)) {
      console.error("Invalid choice");
      return;
    }

    setIsPlaying(true);
    setWaitingForOpponent(true);
    setUserChoice(choice);
    setResult('');

    // Send choice to server
    try {
      socket.send(JSON.stringify({ choice: choice }));
    } catch (error) {
      console.error("Failed to send choice:", error);
      alert("Failed to send your choice. Please try again.");
      setIsPlaying(false);
      setWaitingForOpponent(false);
    }
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
          <div>{game_state?.right_player}: {game_state?.score.p1}</div>
          <div>{game_state?.left_player}: {game_state?.score.p2}</div>
        </div>
      </div>

      {/* Result message */}
      <div className="z-50 flex justify-start items-center">
        <h2
          className={
            game_state.winner ?
              "text-white absolute top-96 font-luckiest text-6xl rounded-md" :
              "hidden"
          } // TODO : this is not working
        >
          {game_state.winner == PlayerInstance.playerData?.username ? "You win!" : "You lose!"}
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
          {['rock', 'paper', 'scissor'].map((choice) => (
            <div
              key={choice}
              className={`relative ${choice === 'paper' || choice === 'scissor' ? 'top-7' : ''}`}
            >
              <img
                className={`${choice1} ${isPlaying ? 'pointer-events-none opacity-50' : ''}`}
                src={`RPS/${choice.charAt(0).toUpperCase() + choice.slice(1)}.svg`}
                alt={choice.toUpperCase()}
                onClick={() => handleUserChoice(choice)}
              />
            </div>
          ))}
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