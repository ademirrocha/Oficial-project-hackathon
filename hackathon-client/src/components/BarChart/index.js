import React from 'react';
import Chart from 'chart.js';

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
							max: 120
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


export default BarChart