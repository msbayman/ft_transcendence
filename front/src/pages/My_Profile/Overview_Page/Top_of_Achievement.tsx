import React from 'react'
import dd from '../Images/back_acheiv.svg'
import "./Top_of_Achievement.css"

const Top_of_Achievement = () => {
  return (
    <div className="all_content_acheiv">
      <div className="part_1_achv">
        <div className="acheiv_1">
          <div className="Date_Acheiv"></div>
          <div className="icone_Acheiv"></div>
          <div className="Title_Acheiv"></div>
        </div>
        <div className="acheiv_2">
          <div className="Date_Acheiv"></div>
          <div className="icone_Acheiv"></div>
          <div className="Title_Acheiv"></div>
        </div>
        <div className="acheiv_3">
          <div className="Date_Acheiv"></div>
          <div className="icone_Acheiv"></div>
          <div className="Title_Acheiv"></div>
        </div>
      </div>
      <div className="Achiev_Title">
        <img src={dd} className="part_2_achv"/>
        <div className="Titre_Acheivement">Top<br/>Achievement</div>
      </div>
    </div>
  );
}

export default Top_of_Achievement