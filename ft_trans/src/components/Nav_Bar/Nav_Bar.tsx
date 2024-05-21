import React from "react";
import './Nav_Bar.css'

function Nav_Bar() {
  return (
    <>
      <div className="main_div">
        <div className="box_left">
          <img id="logo" src='Home_page/logo.png' alt="logo" />
        </div>
        <div className="box_right">
          <div className="menu">
            <img id="img_menu" src="Home_page/lines.svg" alt="logo" />
          </div>
        <ul className="nav_list">
            <li>Home</li>
            <li>Discover</li>
            <li>About</li>
            <li>Login</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Nav_Bar;
