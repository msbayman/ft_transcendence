import { useState } from "react";
import "./Settings_Page.css";
import Security_box from "./Security_box";
import Profile_side from "./Profile_side";

const Settings_Page = () => {
  const [action, setAction] = useState("");

  const Profile = () => {
    setAction(" active");
  };

  const Security = () => {
    setAction("");
  };

  return (
    <div className="wrapper">
      <h1>Settings</h1>

      <div className="options">
        <div className={`abs${action}`} />
        <div className="prfl">
          <a href="#" onClick={Security}>
            Profile
          </a>
        </div>
        <div className="sec">
          <a href="#" onClick={Profile}>
            Security
          </a>
        </div>
      </div>

      <div className="content">
        <Profile_side />
        {/* <Security_box /> */}
      </div>

      <div className="save-cancel">
        <div className="child-btn">
          <button className="btn cancel">Cancel</button>
          <button className="btn save">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Settings_Page;
