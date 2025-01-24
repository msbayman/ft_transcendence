import notif from './Notifications.module.css'

const Notifications = () => {
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
