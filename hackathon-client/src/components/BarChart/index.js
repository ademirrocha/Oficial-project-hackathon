import React, {useState, useEffect} from 'react';
import Chart from 'chart.js';
import socket from '../../config/socket-io.js'
//import io from 'socket.io-client';

import loading from '../../assets/loading.gif';


//var socket = io('http://localhost:8080', { transports: ['websocket', 'polling', 'flashsocket'] })


// BarChart
class BarChart extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
		console.log(this.props.data)
	}

	componentDidUpdate() {
		this.myChart.data.labels = this.props.data.map(d => d.date);
		this.myChart.data.datasets[0].data = this.props.data.map(d => d.average_volume);
		this.myChart.update();
	}

	componentDidMount() {
		this.myChart = new Chart(this.canvasRef.current, {
			type: 'bar',
			options: {
				maintainAspectRatio: false,
				scales: {
					yAxes: [
					{
						ticks: {
							min: 0,
							max: 100
						}
					}
					]
				}
			},
			data: {
				labels: this.props.data.map(d => d.date),
				datasets: [{
					label: this.props.title,
					data: this.props.data.map(d => d.average_volume),
					backgroundColor: this.props.color
				}]
			}
		});
	}

	render() {
		return (
			<canvas ref={this.canvasRef} />
			);
	}
}




	// App
	function ViewCharts(){

		var lastSelectd = 'room_two_hours'

		const [sensorsBarChart, setSensorsBarChart] = useState([]);
		const [selectValue, setSelectValue] = useState('room_two_hours'); 

		socket.emit('room', selectValue)
		useEffect(() => {


			socket.on('res.bar_chart_sensor', (data) => {
				setSensorsBarChart(data);
				
			})

		})	

		socket.on('res.bar_chart_sensor', (data) => {
			setSensorsBarChart(data);

		})

		function handleChange (e){

			console.log(selectValue)

			socket.emit('forceDisconnectRoom')

			//socket = io('http://localhost:8080', { transports: ['websocket', 'polling', 'flashsocket'] })

			//socket.on('connect', function(){
				socket.emit('room', selectValue)

			//})	

		}	

		handleChange('')

		return (
			<>
			<div className="sub chart-wrapper">
			<span>
			Analisar:   
			<select value={selectValue} onChange={e => setSelectValue(e.target.value)}>
			<option value="room_two_hours">Últimas 2 Horas</option>
			<option value="room_six_hours">Últimas 6 Horas</option>
			<option value="room_twelve_hours">Últimas 12 Horas</option>
			<option value="room_twenty_four_hours">Últimas 24 Horas</option>
			<option value="room_five_days">Últimos 5 Dias</option>
			<option value="room_ten_days">Últimos 10 Dias</option>
			</select>
			
			</span>
			<BarChart
			data={sensorsBarChart}
			title="Análise média do volume sonoro"
			color="#B08EA2"
			/>
			</div>
			</>
			);
	}

	export default ViewCharts;