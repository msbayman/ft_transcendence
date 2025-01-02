import * as React from "react";
import other from "./Action_Friends.module.css";

const Action_Friends = () => {
  const [SendRequestFriend, SetSendRequestFriend] = React.useState(true);

  const Is_Send = () => {
    SetSendRequestFriend(!SendRequestFriend);
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
          <button onClick={Is_Send} className={other.cancel_request}>
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
      <div className={other.Block_container}>
        <div className={other.add_block}>
          <img
            src="/Icones/icone_block_friend.png"
            className={other.icone_block}
            alt="icone_block_friend"
          />
          <span>Block</span>
        </div>
      </div>
    </div>
  );
};

export default Action_Friends;
