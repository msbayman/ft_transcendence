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
      setSocket(ws);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // if (PlayerInstance.playerData?.username === data.game_state.left_player)
        // if (data.)

        // Handle different message types
        if (data.type === "error") {
          alert(data.message || "An error occurred");
          return;
        }
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
    }
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Handle game state updates
  const handleGameState = (gameState: any) => {
    // Extract the actual game state from the message
    const actualGameState = gameState.game_state || gameState;

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

    if (gameState.draw) {
      setResult("draw")
    }
    else {
      const username = PlayerInstance.playerData?.username;
      const isPlayerWinner = gameState.winner === username;
      setResult(isPlayerWinner ? "win" : "lose");
    }

    setTimeout(() => {
      navigate("/Overview");
    }, 3000);
  };


  const handleUserChoice = (choice: string) => {
    if (isPlaying || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const validChoices = ['rock', 'paper', 'scissor'];
    if (!validChoices.includes(choice)) {
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
    <div className="bg-[url(/background.svg)] bg-cover bg-center h-screen w-full flex justify-center items-center">
      {/* Result message */}
      <div className="z-50 flex justify-start items-center">
        {result === "draw" ?
          <h2 className="text-white absolute top-96 font-luckiest text-6xl rounded-md"// TODO : this is not working
          >
            Tie !!
          </h2> :
          <h2
            className={
              game_state.winner ?
                "text-white absolute top-96 font-luckiest text-6xl rounded-md" :
                "hidden"
            } // TODO : this is not working
          >
            {game_state.winner == PlayerInstance.playerData?.username ? "You win!" : "You lose!"}
          </h2>
        }
      </div>

      <div className="flex justify-center items-center">
        <div className="absolute">
          <img src="table2.svg" alt="table" />
        </div>

        <div className="absolute bottom-[28rem]">
          <img src="bg-picture.svg" alt="background" />
        </div>

        {/* Player's choices */}
        <div className="flex items-end justify-center gap-[4rem] relative left-5 top-[15.5rem]">
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

      <div className="absolute text-6xl top-[1045px] text-white z-10 font-luckiest">
        {game_state.score.p1} - {game_state.score.p2}
      </div>

      <div className="absolute flex justify-center top-[270px] w-full px-4 gap-16">
        <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center transform scale-x-[-1] flex justify-center items-center">
          <p className="absolute text-white text-2xl transform scale-x-[-1] font-luckiest right-[25px]">
            {game_state?.right_player}
          </p>
          <p className="absolute text-black text-2xl transform scale-x-[-1] font-luckiest left-[9px] bottom-[10px]">
            NoN
          </p>
        </div>
        <div className="w-[100px]">
        </div>
        <div className="relative bg-[url('/name_hold_game.svg')] h-[70px] w-[250px] bg-cover bg-center flex justify-center items-center">
          <p className="absolute text-white text-2xl font-luckiest right-[25px]">
            {game_state?.left_player}
          </p>
          <p className="absolute text-black text-2xl font-luckiest left-[9px] bottom-[10px]">
            NoN
          </p>
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