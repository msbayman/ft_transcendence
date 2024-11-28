import { useState } from 'react'
import './Settings_Page.css'
import TwoFA_Component from './TwoFA-component';
import Password_component from './Password_component';
import Profile_side from './Profile_side'

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
          {/* TODO = make profile page */}
          <Profile_side /> 
        </div>

        <div className="from-box security">
          <h1 className='text-container'>Password</h1>

          <Password_component/>
          <TwoFA_Component />

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