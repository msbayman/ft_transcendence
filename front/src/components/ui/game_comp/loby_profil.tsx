
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
            <img className="absolute rounded-[100%] w-[90%]" src={mydata ? mydata.profile_image.replace("http","https") : "/test_profile.svg"} alt="profil img" />
            <img
                className="absolute bottom-[-50px] left-[145px]"
                src="/lvl_holder.svg"
                alt="lvl holder"
            />
            <div className="fixed mt-[456px] mr-2 font-alexandria text-3xl">
                {mydata ? "lvl: " + mydata.level : "lvl: ?"}
            </div>
            <img
                className="absolute bottom-[-30px] left-[30px]"
                src="/name_hlder.svg"
                alt="name holder"
            />
            <div className="fixed mt-[360px] w-full text-customPurple text-center font-alexandria text-4xl">
                {mydata ? mydata.username : "Loading..."}
            </div>
        </div>
    );
}
export default Player_Profil;