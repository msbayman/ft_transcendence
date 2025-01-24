import React from "react";
import { usePlayer } from "../PlayerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import CustomizedDialogs from "./Dialog";

interface player_data {
  full_name: string;
  username: string;
  email: string;
}

interface ProfileSideProps {
  player: Partial<player_data>; // "Partial<player_data>" tells TypeScript that all the properties inside player_data are optional.
  setPlayerData: React.Dispatch<React.SetStateAction<Partial<player_data>>>;
}

function Profile_side({ player, setPlayerData }: ProfileSideProps) {
  const data_player = usePlayer();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPlayerData({ ...player, [name]: value });
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
              <input type="file" className="change-profile" id="fileInput" />
              <label htmlFor="fileInput" className="change-profile">
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
              placeholder={player?.username || ""}
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
        </div>
      </div>
    </div>
  );
}

export default Profile_side;

