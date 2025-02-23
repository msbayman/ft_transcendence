import Password_component from "./Password_component";
import TwoFA_Component from "./TwoFA-component";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { usePlayer } from "../PlayerContext";
import toast from 'react-hot-toast';
import { config } from "../../../config";

interface PlayerData {
  username: string;
  newPassword: string;
  oldPassword: string;
}


interface SecurityBoxProps {

  setPlayerData: (updatedData: Partial<PlayerData>) => void;

}

function Security_box({}: SecurityBoxProps) {
  const data = usePlayer();
  const { HOST_URL } = config;
  const [playerData, setLocalPlayerData] = useState<Partial<PlayerData>>({
    username: data.playerData?.username,
    oldPassword: '',
    newPassword: ''
  });
  const [changed, setChanged] = useState<boolean>(false);
  // const [error, setError] = useState<string>('');

  const handleSave = async () => {


    try {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("No access token found.");
        return;
      }

      // if (playerData.newPassword && playerData.newPassword?.length < 6)
      //   {
      //   toast.error("too short");
      //   return;
      // }
      if (!playerData.oldPassword || !playerData.newPassword) {
        if (!playerData.oldPassword) {
          toast.error("Old password is required.");
        }
        else
          toast.error("New password is required.");
        return;
      }

      const response = await axios.post(
        `${HOST_URL}/api/user_auth/changePassword`,
        {
          username: playerData.username,
          oldPassword: playerData.oldPassword,
          newPassword: playerData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password updated successfully !");
        setTimeout(()=>{}, 9000);
        setLocalPlayerData(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: ''
        })); // this setter for the local state will reset the input fields to empty
        setChanged(false);
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to update password");
      }
    }
  };

  const handleCancel = () => {
    setLocalPlayerData(prev => ({
      ...prev,
      oldPassword: '',
      newPassword: ''
    }));
    setChanged(false);
  };

  return (
    <div className="from-box security">
      <Password_component
        setPlayerData={setLocalPlayerData}
        setChanged={setChanged}
      />
      <TwoFA_Component />
      <div
        className="save-cancel right-[15rem]"
        style={{ visibility: changed ? "visible" : "hidden" }}
      >
        <div className="child-btn">
          <button 
            className="btn cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="btn save"
            disabled={!changed}
            onClick={handleSave}
            style={{ cursor: changed ? "pointer" : "not-allowed" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Security_box;