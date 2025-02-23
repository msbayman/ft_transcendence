import notif from './Notifications.module.css'
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../PlayerContext';

  interface Notification {
    sender: string;
    profile_image: string;
    content: string;
    type: string;
    id?: string;
  }

  interface NotificationsProps {
    showNotifications: boolean;
    notifications: Notification[];
    onClose: () => void;
    onClear: (id?: string) => void;
  }

  const Notifications_p = ({
    showNotifications,
    notifications,
    onClose,
    onClear,
  }: NotificationsProps) => {
    const loggedInPlayer = usePlayer();
    const navigate = useNavigate();
    const acceptChallenge = (id?: string, sender?: string) => {
      if (loggedInPlayer.ws)
        loggedInPlayer.ws.send(JSON.stringify({ type: "accept_challenge", sender: sender }));
    navigate('/Game_challeng', { state: { challenged: sender, challenger:loggedInPlayer.playerData?.username} });
    onClear(id);
    };
  
    const declineChallenge = (id?: string) => {
      onClear(id);
    };
  
    return (
      <div className={notif.all_content}>
        <div className={notif.part1}>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item ">
                <div className='flex gap-[20px] items-center'>
                  <img className='rounded-full w-[46px] h-[45px]' 
                       src={notification.profile_image} 
                       alt={notification.sender} />
                  <p>{notification.sender} Challenge you in a game</p>
                </div>
                <div className="flex justify-around items-center">
                  <button
                    className="bg-[#3A0CA3] w-[137px] h-[41px] rounded-lg text-white"
                    onClick={() => acceptChallenge(notification.id, notification.sender)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-[#ffffff] text-black w-[137px] h-[41px] rounded-lg"
                    onClick={() => declineChallenge(notification.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={notif.part2}>
          <span className={notif.text}>Notifications</span>
          <button onClick={onClose} className='w-[50px]'>X</button>
        </div>
      </div>
    );
    if (showNotifications)
      return
  };

  export default Notifications_p;