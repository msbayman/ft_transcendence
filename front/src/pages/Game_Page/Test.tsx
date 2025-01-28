import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Game_Tourn from "./Game_Torn";
import { TournContext } from "./TournContext";

	
function Test(){

	const [tournamentState, setTournamentState] = useState({
		p1: "player1",
		p2: "player2",
		p3: "player3",
		p4: "player4",
		semi1: "",
		semi2: "",
		final: "",
	  });

	return (
		<>
			<TournContext.Provider value={tournamentState}>
      			<Game_Tourn />
    		</TournContext.Provider>
		</>
	);
};

export default Test;
