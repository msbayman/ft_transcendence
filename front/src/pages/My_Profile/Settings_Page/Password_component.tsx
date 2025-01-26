import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { usePlayer } from "../PlayerContext";

function Password_component( { player, setPlayerData }: any ) {
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
      setPlayerData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      setPlayerData({ ...player, [name]: value });
      console.log(value);
    };

  useEffect(() => {
    console.log(player);
  }, []);

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
      {...(somo.playerData?.prov_name !== "simple" && { hidden: true })}
    >
      <div className="relative right-[37.5%]">
        <h4 className="relative font-size">Password</h4>
      </div>
      <div className="inpt">
        <div className="spn">
          <label>Current Password</label>
          <div className="w-[100%] flex flex-row items-center justify-center">
            <input
              type={passwordVisible.currentPassword ? "text" : "password"}
              placeholder="Current Password"
              onChange={handleInputChange}
            />
            <i
              onClick={() => toggleVisibility("currentPassword")}
              style={{ visibility: "visible" }}
              className="icon"
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
          <label>New Password</label>
          <div className="w-[100%] flex flex-row items-center justify-center">
            <input
              type={passwordVisible.newPassword ? "text" : "password"}
              placeholder="New Password"
              onChange={handleInputChange}
            />
            <i onClick={() => toggleVisibility("newPassword")} className="icon">
              {passwordVisible.newPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
            </i>
          </div>
        </div>
        {/* <div className="spn">
          <label>Confirm Password</label>
          <div className="w-[100%] flex flex-row items-center justify-center">
            <input
              type={passwordVisible.confirmPassword ? "text" : "password"}
              placeholder="Confirme New Password"
            />
            <i
              className="icon"
              onClick={() => toggleVisibility("confirmPassword")}
            >
              {passwordVisible.confirmPassword ? (
                <BsEyeFill />
              ) : (
                <BsEyeSlashFill />
              )}
            </i>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Password_component;
