import { createGlobalStyle } from 'styled-components';


export default createGlobalStyle`
html {
	background: #4B0082;
	left:0px;
	top:0px;
	position: relative;
	flex-box:
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

nav{
	background: #F0FFFF;
	color: #4B0082;
	position: relative;
	left:0px;
	top:0px;
}

.chart-wrapper {
	padding: 2%;
	display: inline-block;
	border: 1px solid #708090;
	border-radius: 10px;
	margin: 10px;
	background: #F5F5F5;
}

.main.chart-wrapper {
	width: 96%;
	height: 450px;
}

.sub.chart-wrapper {
	width: 47.4%;
	height: 400px;
}


/* Simple responsivenss example */
@media (max-width: 700px) {
	.sub.chart-wrapper {
		width: 96%;
	}
}
.maps {
	width: 96%;
	height: 300px;
}

.map{
	border-radius:8px;
}

.maps::after{
	content: ''
}

.block-map{
	display: inline-block;

}

.group-block{
display: inline-block;
}

.notifications{
	position: absolute;
	right: 10px;
	background: #D4CECE;
	border-radius: 5px;
	width: 350px;
	height: 400px;
	z-index: 99999;
	overflow: auto;
	padding: 10px;
}

.notification{
	background: #E5E8EC;
	padding: 5px;
}

.notification.date{
	font-size: 13px;
}

.strong{
	font-weight: bold;
}

`;