import notif from './Notifications.module.css'

interface Notification {
  sender: string;
  profile_image: string;
  content: string;
  type: string;
  id?: string; // Add a unique ID for each notification (optional)
}

interface NotificationsProps {
  showNotifications: boolean;
  notifications: Notification[]; // Array of notifications
  onClose: () => void;
  onClear: (id?: string) => void; // Optional ID to clear a specific notification
}

const Notifications_p = ({
  showNotifications,
  notifications,
  onClose,
  onClear,
}: NotificationsProps) => {``
  const acceptChallenge = (id?: string) => {
    console.log("Challenge accepted for notification:", id);
    onClear(id); // Clear the specific notification
  };

  const declineChallenge = (id?: string) => {
    console.log("Challenge declined for notification:", id);
    onClear(id); // Clear the specific notification
  };

  return (
    <div className={notif.all_content}>
      <div className={notif.part1}>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item ">
              <div className='flex gap-[20px] items-center'>
                <img className='rounded-full w-[46px] h-[45px]' src={notification.profile_image} alt="" />
                <p>{notification.sender} Challenge you in a game</p>
              </div>
              <div className="flex justify-around items-center">
                <button
                  className="bg-[#3A0CA3] w-[137px] h-[41px] rounded-lg text-white"
                  onClick={() => acceptChallenge(notification.id)}
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
        {/* <span
          className={`${notif.text} ${notif.text1}`}
          onClick={() => onClear()} // Clear all notifications
        >
          Clear All
        </span> */}
      </div>
    </div>
  );
};

export default Notifications_p;