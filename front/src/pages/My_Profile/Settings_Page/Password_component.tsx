
function Password_component() {
  return (
	<div className='pswd'>
		<div className='inpt'>
			<span className='spn'>
				<label htmlFor='1'>Current Password</label>
				<input type="password" placeholder='Current Password' id='1'/>
			</span>
			<span className='spn'>
				<label>New Password</label>
				<input type="password" placeholder='New Password' />
			</span>
			<span className='spn'>
				<label>Confirme New Password</label>
				<input type="password" placeholder='Confirme New Password'/>
			</span>
		</div>
	</div>
  )
}

export default Password_component