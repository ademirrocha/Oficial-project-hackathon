import React, {useState, useEffect} from 'react';
import socket from '../../config/socket-io.js'
import $ from 'jquery';
import './style.css';
import audio from '../../assets/notify.mp3';
import Notify from '../Notify'


function NavBar() {

	const [notifyNotRead, setNotifyNotRead] = useState(0);
	const [notifyShow, setNotifyShow] = useState(false);
	var soundNotify = new Audio(audio);

	useEffect(() => {
		socket.on('res.notify', (data) => {
			setNotifyNotRead(notifyNotRead + 1);

			soundNotify.volume = 0.2
			soundNotify.play();

			console.log('volume audio => ', soundNotify.volume)

			$('.notification').each(function(i) {
				if(! $(this).hasClass('read')){
					$(this).addClass('strong')
				}
			});

		})	
	})	


	function handleNotify(e){
		e.preventDefault();

		if(! notifyShow ){

			$('#div_notify').removeAttr('hidden')
			setNotifyShow(true)

		}else{

			$('#div_notify').attr('hidden', 'hidden')
			$('.strong').addClass('read')
			$('.strong').removeClass('strong')

			setNotifyNotRead(0);
			setNotifyShow(false)
		}

	}

	return (
		<>
		<nav>
		<ul>
		<li className='menu-item brand'>
		<a href="/" >MONITORAÇÃO DE RUÍDOS DE SOM</a>
		</li>
		<li className="menu-item menu-item-notify">
		<a href="#" onClick={handleNotify} ><span className="notificationBadge">{notifyNotRead}</span></a>

		</li>
		</ul>

		</nav>
		<div id="div_notify" hidden="hidden">
		<Notify />
		</div>
		</>
		);
}

export default NavBar;