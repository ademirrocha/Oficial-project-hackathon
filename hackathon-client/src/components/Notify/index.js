import React, {useState, useEffect} from 'react';
import socket from '../../config/socket-io.js'

function Notify(){

	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		socket.on('res.notify', (data) => {
			setNotifications([data, ...notifications]);
			console.log(data)
		})

	})	

	return (
		<div className="notifications">

		{notifications && notifications.map((notify) => (
			<>
			<div className="notification">
			<i className="notification date">{notify.date}</i>
			<br />
			<strong>{notify.author}</strong>: {notify.message}
			</div>
			<hr />
			</>
			))}
			</div>
			)


	}

	export default Notify;