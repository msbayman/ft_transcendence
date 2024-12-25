import React from "react";
import "./Acheiev_Profile.css";

const Acheiev_Profile = () => {
  const if_true = (status: string) => {
    return status === "true" ? "true" : "false";
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
      status: "true",
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
    <div className="all_Ache">
      <div className="Title_Ach">
        <div className="T1_Ach">ACHEIVEMENT</div>
        <div className="T2_Ach">(4 / 17)</div>
      </div>
      <div className="Content_Ach">
        <div className="inside_content_ach ">
          {total.map((tot_ach, index) => (
            <div key={index} className="inside_ache hover-container2">
              <img
                className={if_true(tot_ach.status)}
                src={tot_ach.path_image}
              />
              <span className="hover-text1">{tot_ach.title_achievement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Acheiev_Profile;
