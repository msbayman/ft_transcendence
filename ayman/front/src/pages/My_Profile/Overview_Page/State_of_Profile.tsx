// import React from 'react'
import "./State_of_Profile.css"
import ph_pro from '../Images/profile.png'

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
        <div className='win_state'></div>
        <div className='lose_state'></div>
        <div className='achievement_state'></div>
        <div className='exp_state'></div>
      </div>
    </div>
  );
}

export default State_of_Profile