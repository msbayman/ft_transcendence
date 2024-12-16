import React from "react";

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPlayerData({...player, [name]: value});
    console.log(value);
  };
  return (
    <div className="from-box profile">
      <div className="prf-pic">
        <div className="cover-pic">
          <div className="union-bg-pic">
            <div className="profile-pic"></div>
          </div>
        </div>
        <div className="params">
          <span className="username">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder={player?.username || ""}
              value={player?.username || ""}
              onChange={handleInputChange}
            />
          </span>
          <span className="eml">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder={player?.email || ""}
              value={player?.email || ""}
              onChange={handleInputChange}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile_side;
