import React from "react";
import { usePlayer } from "../PlayerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomizedDialogs from "./Dialog";
import { toast } from "react-toastify";



function Profile_side(){
  
  
  const [error, setError] = useState<string>("");
  const [redorgreen, setRedOrGreen] = useState<boolean>(false);
  
  
  
  const data_player = usePlayer();
  
  const [changed, setChanged] = useState<boolean>(false);
  
  interface player_data {
    username: string;
  }
  const [player_data, setPlayerData] = useState<player_data>({
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
      setRedOrGreen(true);
      setPlayerData(response.data);
      toast.success("Profile updated successfully");
      setError("Profile updated successfully");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Failed to update profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    }
  }
};
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "") {
      setChanged(false);
      return;
    } else setChanged(true);

    setPlayerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(value);
  };
  const [selectedCoverId, setSelectedCoverId] = useState(
    data_player.playerData?.cover_image
  );

  return (
    <div className="from-box profile overflow-hidden">
      <div className="prf-pic">
        <div className="bannerANDprofile">
          <div
            style={{
              backgroundImage: `url(${data_player.playerData?.cover_image})`,
            }}
            className="cover-pic"
          >
            <div className="change-cover">
              <FontAwesomeIcon icon={faPen} />
              <CustomizedDialogs
                setSelectedCover={setSelectedCoverId}
                currentCover={selectedCoverId || ""}
              />
            </div>
          </div>
          <div className="profile-pic">
            <img
              src={data_player.playerData?.profile_image}
              className="Photo"
            />
            <input
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                console.log(file);

                const formData = new FormData();
                formData.append("profile_image", file);

                try {
                  const token = Cookies.get("access_token");
                  if (!token) {
                    throw new Error("No access token found.");
                  }

                  const response = await axios.post(
                    "https://localhost/api/user_auth/upload_profile_image",
                    formData,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );

                  if (response.status === 200) {
                    toast.success("Profile image updated successfully");
                    setPlayerData((prev) => ({
                      ...prev,
                      profile_image: response.data.profile_image,
                    }));
                    window.location.reload(); // Reload the page to update the profile image
                  }
                } catch (error) {
                  // handle error status 413 entity too large
                  if (axios.isAxiosError(error) && error.response?.status === 413) {
                    setError("File size too large. Please upload a smaller file.");
                  } else
                  {
                  if (axios.isAxiosError(error)) {
                    console.error("Failed to upload profile image:", error);
                    setError(error.response?.data?.error );
                  }
                }
                }
              }}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="change-profile"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="change-profile cursor-pointer font-bold">
              <FontAwesomeIcon icon={faPen} />
              Change
            </label>
          </div>
        </div>

        <div className="params">
          <span className="username">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder={data_player?.playerData?.username || ""}
              onChange={handleInputChange}
            />
          </span>
          <span className="eml">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={data_player?.playerData?.email || ""}
              disabled
            />
          </span>
          <div className="save-cancel left-[2rem]">
            <div className="child-btn">
              <button className="btn cancel">Cancel</button>
              <button
                className="btn save"
                disabled={changed ? false : true}
                onClick={handleSave}
                style={{ cursor: changed ? "pointer" : "not-allowed" }}
              >
                Save
              </button>
            </div>
            {error && (
            <p
              className={
                !redorgreen
                  ? "flex justify-end relative right-3 text-red-500 text-xs"
                  : "flex justify-end relative right-3 text-green-500 text-xs"
              }
            >
              {error}
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_side;
