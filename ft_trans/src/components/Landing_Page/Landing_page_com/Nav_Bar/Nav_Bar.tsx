
import "./Nav_Bar.css";


interface Props
{
  show_hide_sd_bar: ()=> void;
}





function Nav_Bar({show_hide_sd_bar}:Props) {
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
          <div className=" lg:flex gap-3 hidden space-x-4 ">
            <a className="a_nav_bar_horz" href="#l_p_1">Home</a>
            <a className="a_nav_bar_horz" href="#l_p_2">Discover</a>
            <a className="a_nav_bar_horz" href="#l_p_3">About</a>
            <a className="a_nav_bar_horz" href="#">Login</a>
            <a className="a_nav_bar_horz" href="#">Sign up</a>
          </div>
          <div className="lg:hidden  pr-10  ">
            <img className="w-10"  onClick={show_hide_sd_bar} src="./Home_page/lines.svg" alt="" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav_Bar;
