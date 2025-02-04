import React from "react";
import { usePlayer } from "../PlayerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { config } from "../../../config";

function Profile_side() {
  const data_player = usePlayer();
 const { HOST_URL } = config;
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
        `${HOST_URL}/api/user_auth/update_player`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setPlayerData(response.data);
        toast.success("Username updated successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error);
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
  };

  const [t, setT] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="from-box profile overflow-hidden">
      <div className="prf-pic">
        <div className="bannerANDprofile">
          <div
            // style={{
            //   backgroundImage: `url(${data_player.playerData?.cover_image})`,
            // }}
            className="cover-pic"
          >
          </div>
          <div className="profile-pic">
            <img
              src={
                !t
                  ? data_player.playerData?.profile_image.replace("http://", "https://")
                  : file
                  ? URL.createObjectURL(file)
                  : undefined
              }
              className="Photo"
            />
            <input
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("profile_image", file);

                try {
                  const token = Cookies.get("access_token");
                  if (!token) {
                    throw new Error("No access token found.");
                  }

                  const response = await axios.post(
                    `${HOST_URL}/api/user_auth/upload_profile_image`,
                    formData,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );

                  if (response.status === 200) {
                    setFile(file);
                    setT(true);
                    toast.success("Profile image updated successfully");
                    setPlayerData((prev) => ({
                      ...prev,
                      profile_image: response.data.profile_image,
                    }));
                  }
                } catch (error) {
                  if (axios.isAxiosError(error) && error.response?.status === 413) {
                    toast.error("File size too large. Please upload a smaller file.");
                  }
                  else {
                    if (axios.isAxiosError(error)) {
                      toast.error(error.response?.data?.error);
                    }
                  }
                }
              }}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="change-profile"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="change-profile cursor-pointer font-bold"
            >
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_side;
