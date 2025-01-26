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
  const [error, setError] = useState<string>("");
  const [redorgreen, setRedOrGreen] = useState<boolean>(false);

  interface player_data {
    username: string;
  }
  const [player_data, setPlayerData] = useState<Partial<player_data>>({
    username: "",
  });

  const handleSave = async (): Promise<void> => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No access token found.");
      }

      interface UpdatePlayerData {
        username?: string;
        oldPassword?: string;
        newPassword?: string;
        profile_picture?: string;
      }

      // Create an object to hold the fields to update
      const updateData: UpdatePlayerData = {};

      // Only include fields that have changed
      if (player_data.username) {
        updateData.username = player_data.username;
      }

      const response = await axios.post<player_data>( // line 44
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
        setRedOrGreen(true);
        toast.success("Profile updated successfully");
        setError("Profile updated successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRedOrGreen(false);
        // toast.error(error.response?.data?.message || "Failed to update profile");
        setError(error.response?.data?.message || "Failed to update profile");
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
            <Security_box
              setPlayerData={(updatedData) =>
                setPlayerData((prev) => ({ ...prev, ...updatedData }))
              }
            />
          )}
        </div>

        <div className="save-cancel">
          <div className="child-btn">
            <button className="btn cancel">Cancel</button>
            <button className="btn save" onClick={handleSave}>
              Save
            </button>
          </div>
          {error && (
            <p
              className={
                !redorgreen
                  ? "flex justify-end items-end relative right-3 text-red-500 text-xs"
                  : "flex justify-end items-end relative right-3 text-green-500 text-xs"
              }
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings_Page;
