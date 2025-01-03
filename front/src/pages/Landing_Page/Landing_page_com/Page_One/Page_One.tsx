import "./Page_One.css";
import { Link } from "react-router-dom";
function Page_One() {
  return (
    <div id="l_p_1">
      <div
        id="main_p1"
        className=" text-2xl  font-bold flex lg:justify-center  lg:items-center   h-screen bg-cover relative"
        style={{ backgroundImage: "url('/Home_page/b_g_1.svg')" }}
      >
        <div
          id="main_box"
          className=" w-full flex justify-center items-center  flex-col lg:ml-20 lg:mb-12 sm:ml-0"
        >
          <div className="text_philo">
            <p>
              Welcome to the <br />
              World of Ping Pong
            </p>
            <button
              id="btn_playnow"
              type="button"
              className="inline-flex items-center  md:text-3xl sm:text-l py-2.5 px-4  max-sm:px-3 max-sm:text-xs lg:text-l font-medium text-center text-white border-2 border-white rounded-3xl"
            >
              <Link to="/signup">Play Now</Link>
            </button>
          </div>
          <img
            id="table_mage"
            src="Home_page/table_img.svg"
            alt="ping pong table image"
          />
        </div>
        <img
          id="wive"
          src="/Home_page/wave.png"
          alt="wave"
          className=" w-full h-full max-h-80  absolute bottom-0 left-0"
        />
      </div>
    </div>
  );
}

export default Page_One;
