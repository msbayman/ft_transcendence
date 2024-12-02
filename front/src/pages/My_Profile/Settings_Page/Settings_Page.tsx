import { useState } from "react";
import "./Settings_Page.css";
import Security_box from "./Security_box";
import Profile_side from "./Profile_side";

const Settings_Page = () => {
  const [action, setAction] = useState("");
  const [tab, setTab] = useState<boolean>(true);

  // const Profile = () => {
  //   setAction(" active");
  // };

  // const Security = () => {
  //   setAction("");
  // };

  const handleTabs = (tab: boolean) => {
    setTab(tab);
    !tab ? setAction(" active") : setAction("");
  };

  return (
    <div className="wrapper">
      <h1 className="w-[70%]">Settings</h1>

      <div className="options">
        <div className={`abs${action}`} />
        <div className="prfl">
          <a href="#" onClick={() => handleTabs(true)}>
            Profile
          </a>
        </div>
        <div className="sec">
          <a href="#" onClick={() => handleTabs(false)}>
            Security
          </a>
        </div>
      </div>

      <div className="content">{tab ? <Profile_side /> : <Security_box />}</div>

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
