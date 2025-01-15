import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import { usePlayer } from "../PlayerContext";

function Password_component() {
  type PasswordFields = "currentPassword" | "newPassword" | "confirmPassword";

  const [passwordVisible, setPasswordVisible] = useState<Record<PasswordFields, boolean>>({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
	});


  const toggleVisibility = (field: PasswordFields) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const somo = usePlayer();

  return (
		
    <div className="pswd" {...(somo.playerData?.prov_name !== "simple" && { hidden: true })}>
			<div className="flex">
				<h1 >Password</h1>
			</div>
      <div className="inpt">
        <span className="spn">
          <label>Current Password</label>
          <i
            className="icon"
            onClick={() => toggleVisibility("currentPassword")}
						style={{ visibility: "visible" }}
          >
            {passwordVisible.currentPassword ? (
              <BsEyeFill />
            ) : (
              <BsEyeSlashFill />
            )}
          </i>
          <input
            type={passwordVisible.currentPassword ? "text" : "password"}
            placeholder="Current Password"
            className="flex flex-row justify-between"
            {...(somo.playerData?.prov_name !== "simple" && { disabled: true })}
          />
        </span>
        <span className="spn">
          <label>New Password</label>
          <i className="icon" onClick={() => toggleVisibility("newPassword")}>
            {passwordVisible.newPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
          </i>
          <input
            type={passwordVisible.newPassword ? "text" : "password"}
            placeholder="New Password"
            className="pass"
          />
        </span>
        <span className="spn">
          <label>Confirm Password</label>
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
          <input
            type={passwordVisible.confirmPassword ? "text" : "password"}
            placeholder="Confirme New Password"
            className="pass"
          />
        </span>
      </div>
    </div>
  );
}

export default Password_component;
