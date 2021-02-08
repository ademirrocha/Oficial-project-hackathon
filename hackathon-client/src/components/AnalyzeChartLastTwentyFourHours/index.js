import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart'
//import socket from '../../config/socket-io.js'

import io from 'socket.io-client';

const socket = io('http://localhost:8089', { transports: ['websocket', 'polling', 'flashsocket'] })
socket.on('connect', function() {
	socket.emit('room', 'room_twenty_four_hours')
})
	// App
	function ViewChartLastTwentyFourHours(){

		const [sensorsBarChart, setSensorsBarChart] = useState([]);
		
		useEffect(() => {
			socket.on('res.chart_sensor_last_twenty_four_hours', (data) => {
				setSensorsBarChart(data);
			})

		})	

		return (
			<>
			<div className="sub chart-wrapper">
			<span>Análise do som nas últimas 24 Horas</span>
			<BarChart
			data={sensorsBarChart}
			title="volume do som"
			color="#B08EA2"
			/>
			</div>
			</>
			);
	}

	export default ViewChartLastTwentyFourHours;