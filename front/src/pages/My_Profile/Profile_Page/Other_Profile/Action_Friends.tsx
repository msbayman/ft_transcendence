import { useEffect, useState } from "react";
import other from "./Action_Friends.module.css";
import Cookies from "js-cookie";
import { usePlayer } from "../../PlayerContext";
import { useNavigate } from "react-router-dom";

interface data_request {
  my_user: string;
  other_user: string;
  states: string;
}

const Action_Friends = ({ username }: { username: string | undefined }) => {
  const mine = usePlayer();

  const [SendRequestFriend, SetSendRequestFriend] = useState(true);
  const [Data, SetData] = useState<data_request | null>(null);
  const [AcceptFriend, SetAcceptFriend] = useState(true);

  const token = Cookies.get("access_token");

  useEffect(() => {
    const check_status = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/listfriends/check-friend-requests/${username}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          // console.log("Friend request sent successfully");
        } else {
          console.error("Failed to send friend request");
        }
        const data = await response.json();
        SetData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    check_status();
  }, [Data?.states]);

  const if_state = (states: string | undefined) => {
    if (states === "denied")
      return (
        <>
          {SendRequestFriend ? (
            <button onClick={Is_Send} className={other.add_friend}>
              <div className={other.add_friend_i}>
                <img
                  src="/Icones/icone_add_friend.png"
                  className={other.icone_add}
                  alt="icone_add_friend"
                />
                <span>Add Friend</span>
              </div>
            </button>
          ) : (
            <div className={other.wait_request}>
              <img
                src="/Icones/icone_add_friend.png"
                className={other.icone_cancel_request}
                alt="icone_cancel_request"
              />
              <span>Waiting for Accept</span>
            </div>
          )}
        </>
      );
    else if (
      states === "pending" &&
      Data?.my_user === mine.playerData?.username
    )
      return (
        <div className={other.wait_request}>
          <img
            src="/Icones/icone_add_friend.png"
            className={other.icone_cancel_request}
            alt="icone_cancel_request"
          />
          <span>Waiting for Accept</span>
        </div>
      );
    else if (
      states === "pending" &&
      Data?.my_user !== mine.playerData?.username
    )
      return (
        <>
          {AcceptFriend ? (
            <div className={other.accept_or_decline}>
              <div className={other.accept}>
                <button onClick={Is_Accept} className={other.accept}>
                  <div className={other.add_friend_i}>
                    <img
                      src="/Icones/icone_add_friend.png"
                      className={other.icone_add}
                      alt="icone_add_friend"
                    />
                    <span>Accept Friend</span>
                  </div>
                </button>
              </div>
              <div className={other.decline}>
                <button onClick={Is_Denied} className={other.decline}>
                  <div className={other.add_friend_i}>
                    <img
                      src="/public/Icones/decline_icone.svg"
                      className={other.icone_add}
                      alt="icone_add_friend"
                    />
                    <span>Decline Friend</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className={other.accept_or_decline}>
              <div className={other.accept1}>
                  <div className={other.add_friend_i}>
                    <img
                      src="front/public/Icones/we_are_friends.svg"
                      className={other.icone_add}
                      alt="icone_add_friend"
                    />
                    <span>Friend</span>
                  </div>
              </div>
              <div className={other.decline1}>
                {/* <button onClick={Is_Denied} className={other.decline1}> */}
                  <div className={other.add_friend_i}>
                    <img
                      src="/Icones/Message_to_User.svg"
                      className={other.icone_add}
                      alt="icone_add_friend"
                    />
                    <span>Message</span>
                  </div>
                {/* </button> */}
              </div>
            </div>
          )}
        </>
      );
    else if (states === "accepted")
      return (
          <div className={other.accept_or_decline}>
            <div className={other.accept1}>
                <div className={other.add_friend_i}>
                  <img
                    src="/public/Icones/we_are_friends.svg"
                    className={other.icone_add}
                    alt="icone_add_friend"
                  />
                  <span>Friend</span>
                </div>
            </div>
            <div className={other.decline1}>
              <button onClick={() => to_message(username)} className={other.decline1}>
                <div className={other.add_friend_i}>
                  <img
                    src="/Icones/Message_to_User.svg"
                    className={other.icone_add}
                    alt="icone_add_friend"
                  />
                  <span>Message</span>
                </div>
              </button>
            </div>
          </div>
      );
  };

  // console.log(Data?.states + ' ---- ' + Data?.my_user + ' ---------- ' + Data?.other_user)

  const sendFriendRequest = async (username: string | undefined) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/listfriends/send-friend-request/${username}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // console.log("Friend request sent successfully");
      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deniedFriendRequest = async (username: string | undefined) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/listfriends/decline-friend-requests/${username}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Friend denied sent successfully");
      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const acceptFriendRequest = async (username: string | undefined) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/listfriends/accept-friend-request/${username}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Friend request accepted successfully");
      } else {
        console.error("Failed to accept friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const navig_to_msg = useNavigate();

  const Is_Send = () => {
    SetSendRequestFriend((SendRequestFriend) => !SendRequestFriend);
    sendFriendRequest(username);
  };
  const Is_Accept = () => {
    acceptFriendRequest(username);
    SetAcceptFriend((AcceptFriend) => !AcceptFriend);
  };
  const Is_Denied = () => {
    deniedFriendRequest(username);
    // SetSendRequestFriend(!SendRequestFriend);
  };
  const to_message = (selectedUser: string) => {
    navig_to_msg(`/Friends?user=${selectedUser}`);
  }

  return <div className={other.All_Action}>{if_state(Data?.states)}</div>;
};

export default Action_Friends;
