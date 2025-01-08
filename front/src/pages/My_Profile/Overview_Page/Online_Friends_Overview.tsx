import { useEffect, useState } from "react"
import "./Online_Friends_Overview.css"
import Message from '../Images/Message_to_User.svg'
import Invite_Play from '../Images/Invite_to_play.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from "js-cookie"
import { usePlayer } from "../PlayerContext"


const Online_Friends_Overview = () => {
  
  interface User_isOnline {
    username: string;
    profile_image: string;
    is_online:boolean;
  }

  const currentUser = usePlayer()

  console.log('----->>>>>   ' + currentUser.playerData?.username)

  const navgate = useNavigate();

  // const token = Cookies.get('access_token');


  const [ListOnline, setListOnline] = useState<User_isOnline[]>([])
  
  const to_message = () => {
    navgate("/Friends")
  }
  
  const to_play = () => {
    navgate("/Play")
  }
  
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      // setTimeout(fetchOnlineUsers,10);
      try {
        if (currentUser.playerData) {
          // Make the GET request with await
          const response = await axios.get("http://127.0.0.1:8000/user_auth/is_online/");

          // Filter out the current user from the response data
          // console.log("*******", response.data, currentUser.playerData)
          const filteredUsers: User_isOnline [] = response.data.filter(
            (user: User_isOnline) => user.username !== currentUser.playerData?.username
          );
          // console.log(filteredUsers , '<<<<<<<<<<<')

          // Set the filtered list
          setListOnline(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching online friends:", error);
      }
    };

    fetchOnlineUsers(); 
  }, [currentUser]);

  
  return (
    <div className="all_content_Online">
      <div className="Title_Onlin">
        <div className="the_title">Online Friends</div>
      </div>
      <div className="Inside_Onlin_Friends">
      <ul className='list_online_user'>
        {ListOnline.map((friend,index) => (
          <li key={index} className="Every_User" >
            <div className='inside_photo'>
            <img src={'http://127.0.0.1:8000' + friend.profile_image} className='Ps_Profile' />
            <span className='online_cercel'></span>
            </div>
            <span className='User_name'>{friend.username}</span>
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