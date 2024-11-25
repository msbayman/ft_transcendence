import './Settings_Page.css'

function TwoFA_Component() {
  return (
	<>
	<h1 className='text-container'>Two-Factor Authentication (2FA)</h1>    
	<div className='TwoFA'>
		<p className='description'>Enhance the security of your account by enabling Two-Factor Authentication (2FA).
			This feature adds an extra of protection, ensuring that only you can access.
			Your account, even if your password is compromised</p>
		<div className='check-TFA'>
			<input type="checkbox" id="twoFAChoice1" name="" value="email" />
			<label>Activate Two-factor authentication (2FA)</label>
		</div>
	</div>
	</>
  )
}

export default TwoFA_Component