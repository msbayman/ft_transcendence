
import "./Nav_Bar.css";

function Nav_Bar() {
  return (

    <nav
      className="sticky top-0 z-10 bg-[#300488] text-white  border-gray-200"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(13, 9, 10, 0.4)",
      }}
    >
      <div className="max-w-8xl mx-auto px-4 ">
        <div className="flex items-center justify-between h-16 lg:pl-40 lg:pr-40">
          <span className="text-2xl font-semibold">
            <img className="w-20 m-10" src="./Home_page/logo.png" alt="" />
          </span>
          <div className=" lg:flex hidden space-x-4 ">
            <a href="#l_p_1">Home</a>
            <a href="#l_p_2">Discover</a>
            <a href="#l_p_3">About</a>
            <a href="#">Login</a>
            <a href="#">Sign up</a>
          </div>
          <div className="lg:hidden  pr-10  ">
            <img className="w-10" src="./Home_page/lines.svg" alt="" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav_Bar;
