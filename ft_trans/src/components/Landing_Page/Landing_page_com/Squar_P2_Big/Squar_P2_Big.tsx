
import'./Squar_P2_Big.css';

interface Props{
  main_icon: string;
  title: string;
  txt: string;  
}


function Squar_P2_Big({main_icon,title,txt}:Props) {
  return (
    <>
      <div className="main_div_b">
        <div className="icon_div_b">
          <img src={main_icon} alt="" />
        </div>
        <div className="title_div_b">{title}</div>
        <div className="text_icon_div_b">
          <div className="text_b">
           {txt}
          </div>
        </div>
      </div>
    </>
  );
}

export default Squar_P2_Big;
