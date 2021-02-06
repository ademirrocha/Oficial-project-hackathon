import React from 'react';
import alert from '../../assets/alert.svg';
import point1 from '../../assets/point1.svg';
import point2 from '../../assets/point2.svg';
import point3 from '../../assets/point3.svg';
import point4 from '../../assets/point4.svg';
import point5 from '../../assets/point5.svg';
import seta from '../../assets/seta.svg';

function PlacesDetected({text, size, pointer, volume, frequence}) {

	


	//console.log(size, 'point_size')
	let point = point4
	if(volume > frequence){
		point = point2
	}else if(volume < frequence){
		point = point3
	}else if(volume == frequence){
		point = point1
	}


	if(pointer == 'point5'){
		point = point5
		size = '32px'
	}
	if(pointer == 'seta'){
		point = seta
		size = '40px'
	}

	return (
		<div>
		<img src={point} alt="Delivery" height={size} />
		{text}
		</div>
		);
	}

	export default PlacesDetected;