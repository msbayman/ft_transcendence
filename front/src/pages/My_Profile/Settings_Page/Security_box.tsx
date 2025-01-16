import Password_component from './Password_component'
import TwoFA_Component from './TwoFA-component'

function Security_box() {
  return (
	<div className="from-box security">
		<Password_component/>
		<TwoFA_Component />
    </div>
  )
}

export default Security_box