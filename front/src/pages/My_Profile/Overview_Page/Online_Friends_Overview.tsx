import { usePlayer } from "../PlayerContext";
import "./Online_Friends_Overview.css";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config";



const Online_Friends_Overview = () => {
  const { onlineFriends } = usePlayer();
  const navigate = useNavigate();
  const { HOST_URL } = config;


  const loggedplayer = usePlayer()
  const to_message = (username:string) => {
    navigate(`/Friends?user=${username}`);
  };


  const to_play = (name: string) => {
    if (loggedplayer.ws && loggedplayer.ws?.readyState === WebSocket.OPEN) {
      loggedplayer.ws.send(JSON.stringify({
        type: "send_challenge",
        sender: name
      }));
    }
  };
  
  return (
    <div className="all_content_Online">
      <div className="Title_Onlin">
        <div className="the_title">Online Friends</div>
      </div>
      {onlineFriends.length > 0 ? (
        <div className="Inside_Onlin_Friends">
          <ul className="list_online_user">
            {onlineFriends.map((friend) => (
              <li key={friend.username} className="Every_User">
                <img
                  src={`${HOST_URL}/${friend.profile_image}`}
                  className="Ps_Profile"
                  alt={`${friend.username}'s profile`}
                />
                <span className="User_name">{friend.username}</span>
                <div className="click">
                  <div className="hove_contain">
                    <button onClick={() => to_message(friend.username || "")}>
                      <img src="/Icones/Message_to_User.svg" className="img_siz" alt="Message" />
                      <span className="hove">Message</span>
                    </button>
                  </div>
                  <div className="hove_contain">
                    <button onClick={() => to_play(friend.username)}>
                      <img src="/Icones/Invite_to_play.svg" className="img_siz" alt="Challenge" />
                      <span className="hove">Challenge</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="No_One">
          <img
            src="/Navbar/No.png"
            style={{ width: 30 }}
            alt="no friend"
          />
          <span>No Friends</span>
        </div>
      )}
    </div>
  );
};


export default Online_Friends_Overview;