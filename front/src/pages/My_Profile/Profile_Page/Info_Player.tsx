import React from "react";
import ph_pro from '../Images/profile.png'
import "./Info_Player.css"


export const Info_Player = () => {
    return (
        <div className='details_of_the_profile'>
            <div className='Photo_and_state'>
                <div className='Photo_of_the_profile'>
                    <img src={ph_pro} className="Photo_P2" />
                </div>
                <div className='States_Profile1'>
                    <div className='Win_and_Achievem'>
                        <div className='Win_State'>30%</div>
                        <div className='Acheivement_State'>20%</div>
                    </div>
                    <div className='Exp_and_Lose'>
                        <div className='Lose_State'>20%</div>
                        <div className='Exp_State'>70%</div>
                    </div>
                </div>
            </div>
            <div className='Info_Player'></div>
        </div>
    )

}
export default Info_Player;