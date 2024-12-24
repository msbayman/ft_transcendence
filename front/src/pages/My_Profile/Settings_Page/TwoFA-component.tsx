import './Settings_Page.css'
import { useState } from 'react'



function TwoFA_Component() {


	const [activated, setActivated] = useState(false);
// 	const [showModal, setShowModal] = useState(false);
// 	const [otp, setOtp] = useState(["", "", "", "", "", ""]);

	const handleClick = () => {
		if (!activated) {
			// setShowModal(true);
			console.log("2FA activated");
		} else {
			setActivated(false);
			console.log("2FA deactivated");
		}
	};

// 	const handleOtpChange = (index: any, value : any) => {
// 		if (/\d/.test(value) || value === "") {
// 			const newOtp = [...otp];
// 			newOtp[index] = value;
// 			setOtp(newOtp);
// 			if (value !== "" && index < 5) {
// 				document.getElementById(`otp-${index + 1}`)?.focus(); // Auto-focus next input
// 			}
// 		}
// 	};

// 	const handleVerify = () => {
// 		const isComplete = otp.every((digit) => digit !== "");
// 		if (isComplete) {
// 			setActivated(true);
// 			setShowModal(false);
// 			console.log("2FA activated");
// 		} else {
// 			alert("Please complete the OTP.");
// 		}
// 	};

//   const handleResend = () => {
//     console.log("Resend OTP");
//   };

  return (
	<>
	<h1 className='text-container'>Two-Factor Authentication (2FA)</h1>    
	<div className='TwoFA'>
		<p className='description'>Enhance the security of your account by enabling Two-Factor Authentication (2FA).
			This feature adds an extra of protection, ensuring that only you can access.
			Your account, even if your password is compromised</p>
		<div className='check-TFA'>
			<input type="checkbox" id="twoFAChoice1" name="" value="email" onClick={handleClick}/>
			{/* {
			showModal && (
				<div className="modal">
				<div className="modal-content">
					<h3>Enter OTP</h3>
					<div className="otp-inputs">
					{otp.map((digit, index) => (
						<input
						key={index}
						id={`otp-${index}`}
						type="text"
						maxLength={1}
						value={digit}
						onChange={(e) => handleOtpChange(index, e.target.value)}
						/>
					))}
					</div>
					<p>
					Don't get OTP? <span className="resend" onClick={handleResend}>Resend Code</span>
					</p>
					<div className="modal-buttons">
					<button onClick={() => setShowModal(false)}>Cancel</button>
					<button onClick={handleVerify}>Verify</button>
					</div>
				</div>
				</div>
			)
	  	} */}
			<label>Activate Two-factor authentication (2FA)</label>
		</div>
	</div>
	</>
  )
}

export default TwoFA_Component

