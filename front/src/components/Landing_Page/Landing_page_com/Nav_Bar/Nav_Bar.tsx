import { Link } from "react-router-dom";
import "./Nav_Bar.css";



function Nav_Bar() {
  return (
    // <nav
    //   className="sticky top-0 z-10 bg-[#300488] text-white  border-gray-200"
    //   style={{
    //     backdropFilter: "blur(20px)",
    //     backgroundColor: "rgba(13, 9, 10, 0.4)",
    //   }}
    // >
    //   <div className="max-w-8xl mx-auto px-4 ">
    //     <div className="flex items-center justify-between h-16 lg:pl-40 lg:pr-40">
    //       <span className="text-2xl font-semibold">
    //        <a href="#"> <img className="w-20 m-10"  src="./Home_page/logo.png" alt="logo game" /></a>
    //       </span>
    //       <div className=" lg:flex gap-3 hidden space-x-4 ">
    //         <a className="a_nav_bar_horz" href="#l_p_1">Home</a>
    //         <a className="a_nav_bar_horz" href="#l_p_2">Discover</a>
    //         <a className="a_nav_bar_horz" href="#l_p_3">About</a>
    //         <a className="a_nav_bar_horz" > <Link to="login">Login</Link></a>
    //         <a className="a_nav_bar_horz" > <Link to="signup">Sign up</Link></a>
    //       </div>
    //       <div className="lg:hidden  pr-10  ">
    //         <img className="w-10"  onClick={show_hide_sd_bar} src="./Home_page/lines.svg" alt="" />
    //       </div>
    //     </div>
    //   </div>
    // </nav>

    <div
      className="nav_bar_div sticky top-0 z-10 bg-[#300488] text-white  border-gray-200 flex"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(13, 9, 10, 0.4)",
      }}
    >
      <div className="div_logo flex-1 p-2">
        <img  className="ml-20"  id="logo_nav_bar" src="game_logo.svg" alt="logo game" />
      </div>

      <div id="paths_list" className="paths_nav_bar flex-1  flex justify-center items-center">
        <ul className="flex">
          <li className="nav_bar_items">
            <a href="">Home</a>
          </li>
          <li className="nav_bar_items">
            <a href="">Discover</a>
          </li>
          <li className="nav_bar_items">
            <a href="">About</a>
          </li>
          <li className="nav_bar_items">
            <a href="">Login</a>
          </li>
          <li className="nav_bar_items">
            <a href="">Signup</a>
          </li>
        </ul>
      </div>
      <img id="options" className="w-10 mr-12 hidden"  src="./Home_page/lines.svg" alt="" />
    </div>
  );
}

export default Nav_Bar;
