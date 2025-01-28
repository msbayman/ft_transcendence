import notif from './Notifications.module.css'
import { usePlayer } from '../PlayerContext';



const Notifications = () => {

  const loggedplayer = usePlayer()
  if (loggedplayer && loggedplayer.ws) {
    console.log("test test zabi ----------------------------", loggedplayer)
    loggedplayer.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      
      if (data.type === "challenge_notification") {
        console.log("Challenge received from1:", data.sender);
        console.log("Challenge content1:", data.content);

      }
    };
  }

  return (
    <div className={notif.all_content}>
      <div className={notif.part1}>
      </div>
      <div className={notif.part2}>
        <span className={notif.text}>Notifications</span>
        <span className={`${notif.text} ${notif.text1}`}>Clear</span>
      </div>
    </div>
  )
}

export default Notifications
