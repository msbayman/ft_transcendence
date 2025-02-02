import "./Settings_Page.css";
import Security_box from "./Security_box";
import Profile_side from "./Profile_side";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../config";

const Settings_Page = () => {
  const [action, setAction] = useState("");
  const [tab, setTab] = useState<boolean>(true);
    const { HOST_URL } = config;
  interface player_data {
    username: string;
  }
  const [player_data, setPlayerData] = useState<player_data>({
    username: "",
  });

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
          `${HOST_URL}/api/user_auth/UserDetailView`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlayerData(response.data);
      } catch (error) {
        console.error("Failed to fetch player data:", error);
      }
    };

    fetchPlayerData();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center min-w-[600px] min-h-[1040px]">
      <div className="wrapper">
        <h1 className="w-[90%] Set">Settings</h1>

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
            <Profile_side />
          ) : (
            <Security_box
              setPlayerData={(updatedData: Partial<player_data>) =>
                setPlayerData((prev) => ({ ...prev, ...updatedData }))
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings_Page;
