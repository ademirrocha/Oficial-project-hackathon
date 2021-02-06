import React, {useState, useEffect} from 'react';
//import socket from '../../config/socket-io.js'
import BarChart from '../BarChart'

import io from 'socket.io-client';

const socket = io('http://localhost:8080', { transports: ['websocket', 'polling', 'flashsocket'] })

socket.on('connect', function() {
	socket.emit('room', 'room_twelve_hours')
})

	// App
	function ViewChartLastTwelveHours(){

		const [sensorsBarChart, setSensorsBarChart] = useState([]);

		useEffect(() => {
			socket.on('res.chart_sensor_last_twelve_hours', (data) => {
				setSensorsBarChart(data);
			})

		})	

		return (
			<>
			<div className="sub chart-wrapper">
			<span>Análise do som nas últimas 12 Horas</span>
			<BarChart
			data={sensorsBarChart}
			title="volume do som"
			color="#B08EA2"
			/>
			</div>
			</>
			);
	}

	export default ViewChartLastTwelveHours;