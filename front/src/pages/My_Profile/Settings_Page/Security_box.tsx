import Password_component from "./Password_component";
import TwoFA_Component from "./TwoFA-component";
import { useState } from "react";

interface player_data {
  newPassword: string;
  oldPassword: string;
}

interface ProfileSideProps {
  setPlayerData: React.Dispatch<React.SetStateAction<Partial<player_data>>>;
}

function Security_box({ setPlayerData }: ProfileSideProps) {
  const handlesave = () => {
    // Save function
    console.log("Save function security");
  };

  const [changed, setChanged] = useState<boolean>(false);

  return (
    <div className="from-box security">
      <Password_component
        setPlayerData={setPlayerData}
        setChanged={setChanged}
      />
      <TwoFA_Component />
      <div className="save-cancel right-[15rem]" style={{ visibility: changed ? "visible" : "hidden" }}>
        <div className="child-btn">
          <button className="btn cancel">Cancel</button>
          <button
            className="btn save"
            disabled={changed ? false : true}
            onClick={handlesave}
            style={{ cursor: changed ? "pointer" : "not-allowed" }}
          >
            Save
          </button>
        </div>
        {/* {error && (
            <p
              className={
                !redorgreen
                  ? "flex justify-end items-end relative right-3 text-red-500 text-xs"
                  : "flex justify-end items-end relative right-3 text-green-500 text-xs"
              }
            >
              {error}
            </p>
          )} */}
      </div>
    </div>
  );
}

export default Security_box;
