import React from "react";
import './Nav_Bar.css'

function Nav_Bar() {
  return (
    <>
      <div className="main_div">
        <div className="box_left">
          <img id="logo" src='/logo.png' alt="" />
        </div>
        <div className="box_right">
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
