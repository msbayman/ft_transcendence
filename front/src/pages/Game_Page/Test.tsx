import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";


function Test(){

  interface Match {
    id: number;
    username: string;
  }

  const [matchs, setmatchs] = useState<Match[]>([])

  const fetchData = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/game/getplydata/")
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
      {matchs.map((match) => <div>
        <p> id: {match.id} </p> 
        <p> username: {match.username} </p>
      </div> )}
    </div>
    
  );
};

export default Test;
