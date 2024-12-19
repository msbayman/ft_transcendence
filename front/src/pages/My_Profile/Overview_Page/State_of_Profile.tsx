// import { ProgressCircleRing, ProgressCircleRoot} from "@/components/ui/progress-circle"
import "./State_of_Profile.css"
import ph_pro from '../Images/profile.png'
import * as React from 'react';
import { CircularProgress,CircularProgressLabel } from "@chakra-ui/progress"

const State_of_Profile = () => {
  return (
    <div className="all_content_state">
      <div className="part_1_state">
        <div className="Photo_Profile">
          <div className="level_player"></div>
          <img src={ph_pro} className="Photo_P" />
        </div>
        <div className="Name_and_Online-state">
          <div className="Name">Kacimo</div>
          <div className="Online-state"> 
          <div className="state" ></div>Online</div>
        </div>
      </div>
      <div className="part_2_state">
        <div className='win_state hover-container'>
          <CircularProgress value={60} color='green' size="100%">
            <CircularProgressLabel fontSize="calc(100px * 0.2)">60%</CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Win Rate</span>
        </div>
        <div className='lose_state hover-container'>
          <CircularProgress value={30} color='red' size="100%">
            <CircularProgressLabel fontSize="calc(100px * 0.2)">30%</CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Lose Rate</span>
        </div>
        <div className='achievement_state hover-container'>
          <CircularProgress value={20} color='rebeccapurple' size="100%">
            <CircularProgressLabel fontSize="calc(100px * 0.2)">20%</CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Acheivement Rate</span>
        </div>
        <div className='exp_state hover-container'>
          <CircularProgress value={80} color='yellow' size="100%">
            <CircularProgressLabel fontSize="calc(80px * 0.2)">120<br/>/320</CircularProgressLabel>
          </CircularProgress>
          <span className="hover-text">Exp Rate</span>
        </div>
      </div>
    </div>
  );
}

export default State_of_Profile