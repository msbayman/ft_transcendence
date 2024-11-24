import { useState } from 'react'
import './Settings_Page.css'

const Settings_Page = () => {
  const [action, setAction] = useState('');

  const Profile = () => {
    setAction(' active');
	};
  
	const Security = () => {
    setAction('');
	};


  return (
    <div className="wrapper">
      <h1>Settings</h1>



      <div className='options'>
        <div className={`abs${action}`} />
        <div className='prfl'>
          <a href="#" onClick={Security}>Profile</a>
        </div>
        <div className='sec'>
          <a href="#" onClick={Profile}>Security</a>
        </div>
      </div>

      <div className='content'>
        <div className="from-box profile">
        </div>

        <div className="from-box security">
          <h1 className='text-container'>Password</h1>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <div>.</div>
          <h1 className='text-container'>Two-Factor Authentication (2FA)</h1>
          
          
          <div className='TwoFA'>
            <p className='description'>Enhance the security of your account by enabling Two-Factor Authentication (2FA).
              This feature adds an extra of protection, ensuring that only you can access.
              Your account, even if your password is compromised</p>
            <div className='check-TFA'>
              <input type="radio" id="twoFAChoice1" name="" value="email" />
              <label>Activate Two-factor authentication (2FA)</label>
            </div>
          </div>

          
        </div>
      </div>


      <div className='save-cancel'>
        <div>
          <button className='btn cancel'>Cancel</button>
        </div>
        <div>
          <button className='btn save'>Save</button>
        </div>
      </div>

    </div>
  )
}

export default Settings_Page