import React from 'react'
import "./Online_Friends_Overview.css"
import users from './Fake_Table.json'
import Message from '../Images/Message_to_User.svg'
import Invite_Play from '../Images/Invite_to_play.svg'
import { useNavigate } from 'react-router-dom'

interface User {
  _id: string;
  User: string;
  Path_Image: string;
  Online: string;
  score: string;
}

const Online_Friends_Overview = () => {
  const navgate = useNavigate();
  const to_message = () => {
    navgate("/Friends")
  }
  const to_play = () => {
    navgate("/Play")
  }
  const onlineFriends = users.filter((user: User) => user.Online === "true");
  return (
    <div className="all_content_Online">
      <div className="Title_Onlin">
        <div className="the_title">Online Friends</div>
      </div>
      <div className="Inside_Onlin_Friends">
      <ul className='list_online_user'>
        {onlineFriends.map((friend) => (
          <li key={friend._id} className="Every_User" >
            <div className='inside_photo'>
            <img src={friend.Path_Image} className='Ps_Profile' />
            <span className='online_cercel'></span>
            </div>
            <span className='User_name'>{friend.User}</span>
            <div className='click'>
              <div className='hove_contain'>
                <button onClick={to_message}><img src={Message} className='img_siz'/>
                  <span className='hove'>Message</span>
                </button>
                </div>
              <div className='hove_contain'>
                <button onClick={to_play}><img src={Invite_Play} className='img_siz' />
                  <span className='hove'>Challenge</span>
                </button>
              </div>
              
              
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default Online_Friends_Overview