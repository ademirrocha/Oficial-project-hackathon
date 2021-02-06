import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart'
import socket from '../../config/socket-io.js'


	// App
	function ViewChartLastTwoHours(){

		var lastSelectd = 'room_two_hours'

		const [sensorsBarChart, setSensorsBarChart] = useState([]);
		socket.emit('room', 'room_two_hours')
		useEffect(() => {
			socket.on('res.chart_sensor_last_two_hours', (data) => {
				setSensorsBarChart(data);
			})

		})	

		return (
			<>
			<div className="sub chart-wrapper">
			<span>
			Análise do som nas últimas 2 Horas:   
			<select >
			<option value="room_two_hours"></option>
			<option value="room_six_hours">Últimas 6 Horas</option>
			<option value="room_twelve_hours">Últimas 12 Horas</option>
			<option value="room_twenty_four_hours">Últimas 24 Horas</option>
			<option value="room_five_days">Últimos 5 Dias</option>
			<option value="room_ten_days">Últimos 10 Dias</option>
			</select>
			
			</span>
			<BarChart
			data={sensorsBarChart}
			title="volume do som"
			color="#B08EA2"
			/>
			</div>
			</>
			);
	}

	export default ViewChartLastTwoHours;