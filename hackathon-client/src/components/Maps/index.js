import React, {useState, useEffect} from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesDetected from '../../components/PlacesDetected';

import socket from '../../config/socket-io.js'

var room_real_time = "room_real_time";

socket.on('connect', function() {
       // Connected, let's sign-up for to receive messages for this room
       socket.emit('room', room_real_time);
       console.log('[IO] Connect => A new connection has been established')

   });

const coordinates = [
{ sensor: 1, latitude: -15.80028100253557, longitude: -46.01022300110646 },
{ sensor: 2, latitude: -15.86671780683419, longitude: -46.19604709506429 },
{ sensor: 3, latitude: -15.852270775231188, longitude: -46.16143289686479 },
{ sensor: 4, latitude: -15.922914504562462, longitude: -46.05554858991217 }
]



function ViewMaps(){

	var sensores = []
	socket.emit('req.sensor', {
		id: 2,
		message: 'tal'
	})

	socket.on('res.sensor', data => {


		sensorsMaps.filter(function (el) {
			return el.sensor !== data.sensor;
		});
		setSensorsMaps([...sensorsMaps, data])
	})


	const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
	const [sensorsMaps, setSensorsMaps] = useState([]);
	useEffect(() => {

		navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setLatitude(latitude);
                setLongitude(longitude);

            },
            (err) => {
                console.log(err);
            },
            {
                timeout: 30000,
            }
        )



		setSensorsMaps(coordinates)
		socket.on('res.previous_sensor', (data) => {
			setSensorsMaps(data)
		})
	}, []);


	const defaultProps = {
		center: {
			lat: -15.922914504562462,
			lng: -46.05554858991217
		},
		zoom: 11
	};
	
	return (

		<div className="maps">
		<span>Monitoração em tempo real</span>
		<GoogleMapReact className="map" 
		bootstrapURLKeys={{ key: "AIzaSyDFEVR21PUndmkFOqjv0gC-VPjecrL3NzY" }}
		defaultCenter={defaultProps.center}
		defaultZoom={defaultProps.zoom}
		>

		{sensorsMaps && sensorsMaps.map((point) => (
			<PlacesDetected
              // key={}
              lat={point.latitude}
              lng={point.longitude}
              text={point.sensor}
	          size={point.point_size}
	          />
	          ))}

			<PlacesDetected
              // key={}
              lat={latitude}
              lng={longitude}
              text=''
	          pointer='point5'
	         />
	         

		</GoogleMapReact>

		</div>

		)
}

export default ViewMaps;