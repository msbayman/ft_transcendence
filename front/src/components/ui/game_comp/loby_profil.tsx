import React from "react";

interface playersData {
    username:string,
    profile_image:string,
    level:number,
}

interface PlayerProfileProps {
    mydata?: playersData;
  }
  

function Player_Profil({  mydata } : PlayerProfileProps) {
    return (
        <div className="relative h-[500px] w-[500px] flex justify-center">
            <img className="absolute rounded-[100%] w-[90%]" src={mydata ? mydata.profile_image : "/public/test_profile.svg"} alt="profil img" />
            <img
                className="absolute bottom-[-50px] left-[145px]"
                src="/public/lvl_holder.svg"
                alt="lvl holder"
            />
            <div className="absolute bottom-[-3px] left-[190px] font-luckiest text-4xl">
                {mydata ? "lvl: " + mydata.level : "lvl: ?"}
            </div>
            <img
                className="absolute bottom-[-30px] left-[30px]"
                src="/public/name_hlder.svg"
                alt="name holder"
            />
            <div className="absolute bottom-[90px] w-full text-customPurple text-center font-luckiest text-5xl">
                {mydata ? mydata.username : "Loading..."}
            </div>
        </div>
    );
}
export default Player_Profil;