import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import { usePlayer } from "../PlayerContext";

function Password_component({ player, setPlayerData, setChanged }: any) {
  type PasswordFields = "currentPassword" | "newPassword" | "confirmPassword";

  const [passwordVisible, setPasswordVisible] = useState<
    Record<PasswordFields, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (value === "") {
      setChanged(false);
      return;
    }
    else
      setChanged(true);


    setPlayerData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    setPlayerData({ ...player, [name]: value });
    console.log(value);

    if (name === "newPassword") {
      setPlayerData({ ...player, newPassword: value });
      console.log(value);
    }

  };

  const toggleVisibility = (field: PasswordFields) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const somo = usePlayer();

  return (
    <div
      className="pswd"
      {...(somo.playerData && 'prov_name' in somo.playerData && somo.playerData.prov_name !== "simple" && { hidden: true })}
    >
      <div className="relative right-[37.5%]">
        <h4 className="relative font-size">Password</h4>
      </div>
      <div className="inpt">
        <div className="spn">
          <label className="relative top-[1.3rem] right-[5rem] pr-[1.25rem] pl-[1.25rem]">Current Password</label>
          <div className="w-[100%] flex flex-row items-center justify-end">
            <input
              type={passwordVisible.currentPassword ? "text" : "password"}
              placeholder="Current Password"
              onChange={handleInputChange}
              className="z-10 max-w-full relative bottom-[2.3rem]"
            />
            <i
              onClick={() => toggleVisibility("currentPassword")}
              style={{ visibility: "visible" }}
              className="icon z-20 relative bottom-[2.3rem]"
            >
              {passwordVisible.currentPassword ? (
                <BsEyeFill />
              ) : (
                <BsEyeSlashFill />
              )}
            </i>
          </div>
        </div>
        <div className="spn">
          <label className="relative top-[1.3rem] right-[5rem] pr-[1.25rem] pl-[1.25rem]" >New Password</label>
          <div className="w-[100%] flex flex-row items-center justify-end">
            <input
              type={passwordVisible.newPassword ? "text" : "password"}
              placeholder="New Password"
              onChange={handleInputChange}
              className="z-10 max-w-full relative bottom-[2.3rem]"
            />
            <i onClick={() => toggleVisibility("newPassword")} className="icon z-20 relative bottom-[2.3rem]">
              {passwordVisible.newPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Password_component;
