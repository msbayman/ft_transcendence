import { useState } from "react";
import other from "./Action_Friends.module.css";

const Action_Friends = ({ username }: { username: string }) => {
  const [SendRequestFriend, SetSendRequestFriend] = useState(true);
  const [SendRequestBlock, SetSendRequestBlock] = useState(true);
  // const receiver = username;

  const sendFriendRequest = async (username: string) => {
    console.log(username + '<<<<<<<----------------')
    try {
        const response = await fetch(`http://127.0.0.1:8000/listfriends/send_to_friend/${username}/`, {
            method: 'POST',
            // headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json',
            // },
        });

        if (response.ok) {
            console.log('Friend request sent successfully');
        } else {
            console.error('Failed to send friend request');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
const acceptFriendRequest = async (username: string) => {
  try {
      const response = await fetch(`http://127.0.0.1:8000/listfriends/accept_tobe_friend/${username}/`, {
          method: 'POST',
          // headers: {
          //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
          //     'Content-Type': 'application/json',
          // },
      });

      if (response.ok) {
          console.log('Friend request accepted successfully');
      } else {
          console.error('Failed to accept friend request');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

  const Is_Send = () => {
    sendFriendRequest(username)
    SetSendRequestFriend(!SendRequestFriend);
  };
  const Is_Accept = () => {
    acceptFriendRequest(username)
    SetSendRequestFriend(!SendRequestFriend);
  };

  const Is_Block = () => {
    SetSendRequestBlock(!SendRequestBlock);
  };

  return (
    <div className={other.All_Action}>
      <div className={other.Add_container}>
        {SendRequestFriend ? (
          <button onClick={Is_Send} className={other.add_friend}>
            <div className={other.add_friend}>
              <img
                src="/Icones/icone_add_friend.png"
                className={other.icone_add}
                alt="icone_add_friend"
              />
              <span>Add Friend</span>
            </div>
          </button>
        ) : (
          <button onClick={Is_Accept} className={other.cancel_request}>
            <div className={other.cancel_request}>
              <img
                src="/Icones/icone_add_friend.png"
                className={other.icone_cancel_request}
                alt="icone_cancel_request"
              />
              <span>Cancel Request</span>
            </div>
          </button>
        )}
      </div>
      {/* <div className={other.Block_container}>
        <div className={other.add_block}>
          <img
            src="/Icones/icone_block_friend.png"
            className={other.icone_block}
            alt="icone_block_friend"
          />
          <span>Block</span>
        </div>
      </div> */}
      <div className={other.Block_container}>
        {SendRequestBlock ? (
          <button onClick={Is_Block} className={other.add_block}>
            <div className={other.add_block}>
              <img
                src="/Icones/icone_block_friend.png"
                className={other.icone_block}
                alt="icone_block_friend"
              />
              <span>Block</span>
            </div>
          </button>
        ) : (
          <button onClick={Is_Block} className={other.add_block}>
            <div className={other.add_block}>
              <img
                src="/Icones/icone_block_friend.png"
                className={other.icone_block}
                alt="icone_block_friend"
              />
              <span>Unblock</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Action_Friends;
