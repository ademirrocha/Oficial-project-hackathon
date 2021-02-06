import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart'
//import socket from '../../config/socket-io.js'

import io from 'socket.io-client';

const socket = io('http://localhost:8080', { transports: ['websocket', 'polling', 'flashsocket'] })
socket.on('connect', function() {
	socket.emit('room', 'room_ten_days')
})
	// App
	function ViewChartLastTenDays(){

		const [sensorsBarChart, setSensorsBarChart] = useState([]);
		
		useEffect(() => {
			socket.on('res.chart_sensor_last_ten_days', (data) => {
				setSensorsBarChart(data);
			})

		})	

		return (
			<>
			<div className="sub chart-wrapper">
			<span>Análise do som nos últimos 10 Dias</span>
			<BarChart
			data={sensorsBarChart}
			title="volume do som"
			color="#B08EA2"
			/>
			</div>
			</>
			);
	}

	export default ViewChartLastTenDays;