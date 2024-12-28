import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Game_Remot()
{
	const [message, setMessage] = useState('');
	useEffect(() => {
		axios.get('http://127.0.0.1:8000/api/pingpong/')
		.then((response) => {
			setMessage(response.data.message);
		})
		.catch((error) => {
			console.error('There was an error!', error);
		});
	}, []);
    return (
        <>
			<div>
				<h1>React-Django Connection</h1>
				<p>{message}</p>
			</div>
        </>
    );
}

export default Game_Remot;