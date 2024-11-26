import { BsEyeFill , BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";


function Password_component() {

	const [passwordVisible, setPasswordVisible] = useState({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
	});

	const toggleVisibility = (field: string) => {
		console.log("heeere");
		setPasswordVisible((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};
	

  return (
	<div className='pswd'>
		<div className='inpt'>
			<span className='spn'>
				<label>Current Password</label>
					<i className="icon" onClick={() => toggleVisibility("currentPassword")}>
						{passwordVisible.currentPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
					</i>
				<input type={passwordVisible.currentPassword ? "text" : "password"} placeholder='Current Password' className="pass" />
			</span>
			<span className='spn'>
				<label>New Password</label>
					<i className="icon" onClick={() => toggleVisibility("newPassword")}>
						{passwordVisible.newPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
					</i>
				<input type={passwordVisible.newPassword ? "text" : "password"} placeholder='New Password' className="pass" />
			</span>
			<span className='spn'>
				<label>Confirme New Password</label>
					<i className="icon" onClick={() => toggleVisibility("confirmPassword")}>
						{passwordVisible.confirmPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
					</i>
				<input type={passwordVisible.confirmPassword ? "text" : "password"} placeholder='Confirme New Password' className="pass" />
			</span>
		</div>
	</div>
  )
}

export default Password_component