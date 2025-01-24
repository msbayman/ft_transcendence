import "./Settings_Page.css";
import Security_box from "./Security_box";
import Profile_side from "./Profile_side";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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


  const handleSave = async (): Promise<void> => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No access token found.");
    }

    interface UpdatePlayerData {
      username?: string;
    }

    // Create an object to hold the fields to update
    const updateData: UpdatePlayerData = {};
    
    // Only include fields that have changed
    if (player_data.username) {
      updateData.username = player_data.username;
    }

    const response = await axios.post<player_data>(
      "https://localhost/api/user_auth/update_player",
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle successful response
    if (response.status === 200) {
      setPlayerData(response.data);
      toast.success("Profile updated successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Failed to update profile:", error);
    }
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
          "https://localhost/api/user_auth/UserDetailView",
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
            <button
              className="btn save"
              onClick={handleSave}
            >
            Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings_Page;
