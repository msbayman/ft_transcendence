

import "./Page_Two.css";
import Squar_P2_Small from "../Squar_P2_Small/Squar_P2_Small";
import Squar_P2_Big from "../Squar_P2_Big/Squar_P2_Big";
function Page_Two() {
  return (
    <div id="l_p_2"
      className="main_p_2 relative overflow-x-hidden m-0 h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: 'url("/Home_page/page_2_background.svg")' }}
    >
      <div className="top_p2 absolute top-0 flex flex-wrap gap-2 justify-evenly flex-col lg:flex-row   items-center w-screen flex-[6] ">
        <Squar_P2_Small
          title="Multiplayer"
          txt="1v1 - 2v2 - Ai "
          small_icon=""
          main_icon="./Home_page/landing_page2_icones/Icon_multi.svg"
        />
        <Squar_P2_Big
          title="Challenges"
          txt="Challenge Your Friend and Have Fun With More Game Modes"
          main_icon="./Home_page/landing_page2_icones/challenges.svg"
        />
        <Squar_P2_Small
          title="Easy to Play"
          txt="Just by Clicking Arrow Keys"
          small_icon="./Home_page/landing_page2_icones/arrows.svg"
          main_icon="./Home_page/landing_page2_icones/easy.svg"
        />
      </div>
      <div className="bottom_p2 flex justify-center items-center w-screen flex-[4]">
        <div className="foot_page2">

          <div className="foot_box">

          <div className="b1">
            <div className="top1">The Game</div>
            <div className="bottom1">Is free to play</div>
          </div>
          <div className="b2">
            <div className="top2">More than 2h</div>
            <div className="bottom2">As a daily playing rate</div>
          </div>
          <div className="b3">
            <div className="top3">Over 65,000</div>
            <div className="bottom3">Active accounts</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page_Two;
