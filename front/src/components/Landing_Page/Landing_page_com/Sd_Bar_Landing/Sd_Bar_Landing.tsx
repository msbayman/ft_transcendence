
import { Link } from 'react-router-dom'
import './Sd_Bar_Landing.css'
function Sd_Bar_Landing() {
    return (
        <div className='main_div_sid_land'>
            <ul className='sid_land_list' >
                <li className='sb_item'><a  href="#l_p_1">Home</a></li>
                <li className='sb_item'><a  href="#l_p_2">Discover</a></li>
                <li className='sb_item'><a  href="#l_p_3">About</a></li>
                <li className='sb_item'> <Link to="login">Login</Link></li>
                <li className='sb_item'> <Link to="signup">Signup</Link></li>
            </ul>
        </div>
      )
}

export default Sd_Bar_Landing