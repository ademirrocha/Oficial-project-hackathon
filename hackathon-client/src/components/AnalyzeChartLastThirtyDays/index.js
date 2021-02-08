import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart'
//import socket from '../../config/socket-io.js'

import io from 'socket.io-client';

const socket = io('http://localhost:8089', { transports: ['websocket', 'polling', 'flashsocket'] })
socket.on('connect', function() {
	socket.emit('room', 'room_thirty_days')
})
	// App
	function ViewChartLastThirtyDays(){

		const [sensorsBarChart, setSensorsBarChart] = useState([]);
		
		useEffect(() => {
			socket.on('res.chart_sensor_last_thirty_days', (data) => {
				setSensorsBarChart(data);
			})

		})	

		return (
			<>
			<div className="main chart-wrapper">
			<span>Análise do som nos últimos 30 Dias</span>
			<BarChart
			data={sensorsBarChart}
			title="volume do som"
			color="#B08EA2"
			/>
			</div>
			</>
			);
	}

	export default ViewChartLastThirtyDays;