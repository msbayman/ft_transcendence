import React from "react";

import "./Page_One.css";
import Nav_Bar from "../Nav_Bar/Nav_Bar";
function Page_One() {
  return (
    <>
      <div className="main_p_1">
        <Nav_Bar   />
        <div className="dev_text">
          <div className="text_1">
            <p>Welcome to the </p> <p>World of Ping Pong</p>
          </div>
          <div className="text_2"><img src="Home_page/Best_Game.svg" alt="best game" /></div>
            <button id="btn_play_now">Play Now !</button>
        </div>
        <div className="div_svg"></div>
        <div className="ft_p1"><img id="wave" src="Home_page/wave.png" alt="wave" /></div>
      </div>
    </>
  );
}

export default Page_One;
