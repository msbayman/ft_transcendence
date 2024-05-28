
import "./Page_One.css";
function Page_One() {

  return (
    <>
      <div
        id="main_p1"
        className=" text-2xl  font-bold flex lg:justify-start  lg:items-center  max-lg:justify-center max-lg:items-center  h-screen bg-cover relative"
        style={{ backgroundImage: "url('/Home_page/b_g_1.jpeg')" }}
      >
        <div
          id="main_box"
          className=" flex justify-center items-center  flex-col lg:ml-20 lg:mb-12 sm:ml-0"
        >
          <div className=" text_Chau lm:ml-20 mb-10  lg:mt-36 text-center sm:ml-0">
            <div className="  lg:text-7xl md:text-4xl sm:-2xl">
              Welcome to the
            </div>
            <div className="  lg:text-7xl md:text-4xl sm:-2xl">
              World of Ping Pong
            </div>
          </div>

          <div className="flex flex-row items-center">
            <img
              src="Home_page/Best_Game.svg"
              alt="best game"
              className="max-lg:w-7rem lg:mr-2 sm:mr-0.5 sm:text-m"
            />
            <button  id="btn_playnow"
              type="button"

              className="inline-flex items-center  md:text-3xl sm:text-l py-2.5 px-4  max-sm:px-3 max-sm:text-xs lg:text-l font-medium text-center text-white border-2 border-white rounded-3xl"
            >
              Play Now
            </button>
          </div>
        </div>

        <img
          id="wive"
          src="/Home_page/wave.png"
          alt="wave"
          className=" w-full h-full max-h-80 absolute bottom-0 left-0"
        />
      </div>
    </>
  );
}

export default Page_One;
