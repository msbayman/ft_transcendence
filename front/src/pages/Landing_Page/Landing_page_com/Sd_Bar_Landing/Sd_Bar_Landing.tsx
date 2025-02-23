import { Link } from "react-router-dom";
import { useState } from "react";
import "./Sd_Bar_Landing.css";

function Sd_Bar_Landing() {
  const [isVisible, setIsVisible] = useState(true);
  const handleNavigation = () => {
    setIsVisible(!isVisible);
    ;
  };

  return (
    <div className={`main_div_sid_land ${!isVisible ? "hide" : ""}`}>
      <ul className="sid_land_list">
        <li className="sb_item">
          <a href="#l_p_1" onClick={() => handleNavigation()}>
            Home
          </a>
        </li>
        <li className="sb_item">
          <a href="#l_p_2" onClick={() => handleNavigation()}>
            Discover
          </a>
        </li>
        <li className="sb_item">
          <a href="#l_p_3" onClick={() => handleNavigation()}>
            About
          </a>
        </li>
        <li className="sb_item">
          <Link to="login" onClick={() => handleNavigation()}>
            Login
          </Link>
        </li>
        <li className="sb_item">
          <Link to="signup" onClick={() => handleNavigation()}>
            Signup
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sd_Bar_Landing;
