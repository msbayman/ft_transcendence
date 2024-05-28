
import "./Squar_P2_Small.css";

interface Props{
  main_icon: string;
  small_icon: string;
  title: string;
  txt: string;  
}




function Squar_P2_Small({main_icon,small_icon,title,txt}:Props) {
  return (
    <>
      <div className="main_div_s">
        <div className="icon_div_s">
          <img src={main_icon} alt="" />
        </div>
        <div className="title_div_s">{title}</div>
        <div className="text_icon_div_s">
          <div className="text_s">{txt} </div>
          <div className="icon_s"><img src = {small_icon}></img></div>
        </div>
      </div>
    </>
  );
}
export default Squar_P2_Small;
