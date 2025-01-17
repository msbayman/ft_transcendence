import React from "react";

import test_profil from "../../../../public/test_profile.svg";
import lvlHolder from "../../../../public/lvl_holder.svg";
import nameHolder from "../../../../public/name_hlder.svg";

function Player_Profil() {
    return (
        <div className="relative h-[500px] w-[500px]">
            <img className="absolute " src={test_profil} alt="" />
            <img
                className="absolute bottom-[-50px] left-[145px]"
                src={lvlHolder}
                alt="lvl holder"
            />
            <div className="absolute bottom-[-3px] left-[190px] font-luckiest text-5xl">
                LVL 3
            </div>
            <img
                className="absolute bottom-[-30px] left-[30px]"
                src={nameHolder}
                alt="name holder"
            />
            <div className="absolute bottom-[90px] left-[155px] text-customPurple font-luckiest text-5xl">
                KACEMO
            </div>
        </div>
    );
}
export default Player_Profil;