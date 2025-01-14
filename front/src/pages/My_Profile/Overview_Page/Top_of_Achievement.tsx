import shape_acheive from '../Images/back_acheiv.svg'
import best_score from '../Images/best_score.png'
import  one_win from '../Images/win_one.png'
import  two_win from '../Images/win_two.png'
import "./Top_of_Achievement.css"

const Top_of_Achievement = () => {
  return (
    <div className="all_content_acheiv">
      <div className="part_1_achv">
        <div className="acheiv">
          <div className="icone_Acheiv">
            <img src={one_win} className="ach_img" />
          </div>
          <div className="Title_Acheiv">Win One Game</div>
        </div>
        <div className="acheiv">
          <div className="icone_Acheiv">
            <img src={two_win} className="ach_img" />
          </div>
          <div className="Title_Acheiv">Win two game in raw</div>
        </div>
        <div className="acheiv">
          <div className="icone_Acheiv">
            <img src={best_score} className="ach_img"/>
          </div>
          <div className="Title_Acheiv">Win with max score</div>
        </div>
      </div>
      <div className="Achiev_Title">
        <img src={shape_acheive} className="part_2_achv" />
        <div className="Titre_Acheivement">
          Top
          <br />
          Achievement
        </div>
      </div>
    </div>
  );
}

export default Top_of_Achievement