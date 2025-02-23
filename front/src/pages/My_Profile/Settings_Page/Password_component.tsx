import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import { usePlayer } from "../PlayerContext";

interface PasswordComponentProps {
  setPlayerData: React.Dispatch<React.SetStateAction<any>>;
  setChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

function Password_component({ setPlayerData, setChanged }: PasswordComponentProps) {
  const [passwordVisible, setPasswordVisible] = useState({
    oldPassword: false,
    newPassword: false,
  });

  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    
    setChanged(value !== "");

    // console.log(e.target);
    setPlayerData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

  };

  interface PasswordVisibility {
    oldPassword: boolean;
    newPassword: boolean;
  }

  const toggleVisibility = (field: keyof PasswordVisibility) => {
    setPasswordVisible((prev: PasswordVisibility) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const somo = usePlayer();

  return (
    <div
      className="pswd"
      {...(somo.playerData && 'prov_name' in somo.playerData && 
          somo.playerData.prov_name !== "simple" && { hidden: true })}
    >
      <div className="relative right-[37.5%]">
        <h4 className="relative font-size">Password</h4>
      </div>
      <div className="inpt">
        <div className="spn">
          <label className="relative top-[1.3rem] right-[5rem] pr-[1.25rem] pl-[1.25rem]">
            Current Password
          </label>
          <div className="w-[100%] flex flex-row items-center justify-end">
            <input
              type={passwordVisible.oldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Current Password"
              onChange={handleInputChange}
              className="z-10 max-w-full relative bottom-[2.3rem]"
            />
            <i
              onClick={() => toggleVisibility("oldPassword")}
              style={{ visibility: "visible" }}
              className="icon z-20 relative bottom-[2.3rem]"
            >
              {passwordVisible.oldPassword ? (
                <BsEyeFill />
              ) : (
                <BsEyeSlashFill />
              )}
            </i>
          </div>
        </div>
        <div className="spn">
          <label className="relative top-[1.3rem] right-[5rem] pr-[1.25rem] pl-[1.25rem]">
            New Password
          </label>
          <div className="w-[100%] flex flex-row items-center justify-end">
            <input
              type={passwordVisible.newPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              onChange={handleInputChange}
              className="z-10 max-w-full relative bottom-[2.3rem]"
            />
            <i onClick={() => toggleVisibility("newPassword")} 
               className="icon z-20 relative bottom-[2.3rem]">
              {passwordVisible.newPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password_component;