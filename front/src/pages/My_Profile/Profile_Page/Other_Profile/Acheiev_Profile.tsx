import React from "react";
import other from "./Acheiev_Profile.module.css";
// import classNames from 'classnames';

const Acheiev_Profile = () => {
  const if_true = (status: string) => {
    return status === "true" ? other.true : other.false;
  };

  const total = [
    {
      id: 1,
      title_achievement: "Win One Game",
      status: "true",
      path_image: "/Achievements/unlock1.png",
    },
    {
      id: 2,
      title_achievement: "Win two Games",
      status: "false",
      path_image: "/Achievements/unlock2.png",
    },
    {
      id: 3,
      title_achievement: "Win with max score",
      status: "false",
      path_image: "/Achievements/unlock3.png",
    },
    {
      id: 4,
      title_achievement: "streak 3 games",
      status: "true",
      path_image: "/Achievements/unlock4.png",
    },
    {
      id: 4,
      title_achievement: "streak 3 games",
      status: "false",
      path_image: "/Achievements/unlock4.png",
    },
    {
      id: 4,
      title_achievement: "streak 3 games",
      status: "false",
      path_image: "/Achievements/unlock4.png",
    },
    
  ];
  return (
    <div className={other.all_Ache}>
      <div className={other.Title_Ach}>
        <div className={other.T1_Ach}>ACHEIVEMENT</div>
        <div className={other.T2_Ach}>(4 / 17)</div>
      </div>
      <div className={other.Content_Ach}>
        <div className={other.inside_content_ach}>
          {total.map((tot_ach, index) => (
            <div key={index} className={`${other.inside_ache} ${other.hover_container2}`}>
              <img
                className={`${if_true(tot_ach.status)}`}
                src={tot_ach.path_image}
              />
              <span className={other.hover_text1}>{tot_ach.title_achievement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Acheiev_Profile;
