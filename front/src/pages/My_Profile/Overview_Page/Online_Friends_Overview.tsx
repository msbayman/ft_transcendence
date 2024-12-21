import React from 'react'
import "./Online_Friends_Overview.css"
import users from './Fake_Table.json'

interface User {
  _id: string;
  User: string;
  Path_Image: string;
  Online: string; // Stored as string in JSON
  score: string;
}

const Online_Friends_Overview = () => {
  const onlineFriends = users.filter((user: User) => user.Online === "true");
  const extractIdNumber = (_id: string): number => {
    return parseInt(_id.replace("#", ""), 10);
  };
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
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default Online_Friends_Overview