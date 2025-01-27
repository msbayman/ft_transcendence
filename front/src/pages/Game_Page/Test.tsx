import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";


function Test(){

  interface Match {
    id: number;
    player1: string;
    player2: string;
    player1_score: number;
    player2_score: number;
  }

  const [matchs, setmatchs] = useState<Match[]>([])

  const fetchData = async () => {
    try {
      const token = Cookies.get("access_token");
      const resp = await fetch("http://127.0.0.1:8000/api/game/getdata/",
      {
		headers: {
		  Authorization: `Bearer ${token}`,
		}
      }
      )
      const data = await resp.json()
      setmatchs(data)
    } catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>test page</div>
      {matchs.map((match) => <div>
        <p> id: {match.id} </p> 
        <p> p1: {match.player1} </p>
        <p> p2: {match.player2} </p>
        <p> sc1: {match.player1_score} </p>
        <p> sc2: {match.player2_score} </p>
      </div> )}
    </div>
    
  );
};

export default Test;
