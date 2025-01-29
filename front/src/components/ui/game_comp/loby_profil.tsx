import React from "react";

function Player_Profil({ mydata }) {
    return (
        <div className="relative h-[500px] w-[500px]">
            <img className="absolute " src="/public/test_profile.svg" alt="" />
            <img
                className="absolute bottom-[-50px] left-[145px]"
                src="/public/lvl_holder.svg"
                alt="lvl holder"
            />
            <div className="absolute bottom-[-3px] left-[190px] font-luckiest text-5xl">
                {mydata ? mydata.lvl : "lvl: ?"}
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