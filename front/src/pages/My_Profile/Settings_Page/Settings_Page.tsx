import "./Settings_Page.css";
import Security_box from "./Security_box";
import Profile_side from "./Profile_side";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";


const Settings_Page = () => {
  const [action, setAction] = useState("");
  const [tab, setTab] = useState<boolean>(true);

  interface player_data {
    username: string;
    email: string;
  }
  const [player_data, setPlayerData] = useState<player_data>({
    username: "",
    email: "",
  });

  const handleSave = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("No access token found.");

      const response = await axios.post(
        "http://127.0.0.1:8000/user_auth/update_player",
        player_data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlayerData(response.data);
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleTabs = (tab: boolean) => {
    setTab(tab);
    !tab ? setAction(" active") : setAction("");
  };

  // Fetch player data

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const token = Cookies.get("access_token"); // Ensure token is available
        if (!token) throw new Error("No access token found. Please log in.");

        const response = await axios.get<player_data>(
          "http://127.0.0.1:8000/user_auth/UserDetailView",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlayerData(response.data);
        console.log("---------->  Player data fetched:      ", response.data);
      } catch (error) {
        console.error("Failed to fetch player data:", error);
      }
    };

    fetchPlayerData();
  }, []);
  // -----------------------------------------

  // TODO: Implement the following:
  // 1. Handle save
  // 2. Handle update player data
  

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="wrapper">
        <h1 className="w-[90%]">Settings</h1>

        <div className="options">
          <div className={`abs${action}`} />
          <div className="prfl cursor-pointer">
            <h4 onClick={() => handleTabs(true)}>Profile</h4>
          </div>
          <div className="sec cursor-pointer">
            <h4 onClick={() => handleTabs(false)}>Security</h4>
          </div>
        </div>

        <div className="content overflow-scroll scrollbar-hide">
          {tab ? (
            <Profile_side
              player={player_data}
              setPlayerData={(updatedData) =>
                setPlayerData((prev) => ({ ...prev, ...updatedData }))
              }
            />
          ) : (
            <Security_box />
          )}
        </div>

        <div className="save-cancel">
          <div className="child-btn">
            <button className="btn cancel">Cancel</button>
            <button className="btn save" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings_Page;
