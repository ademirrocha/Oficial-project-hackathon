import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';

import GoogleMapReact from 'google-map-react';

import PlacesDetected from '../../components/PlacesDetected';

const socket = io('http://localhost:8080', { transports: ['websocket', 'polling', 'flashsocket'] })

var room = "real_time";

socket.on('connect', function() {
       // Connected, let's sign-up for to receive messages for this room
  socket.emit('room', room);
  console.log('[IO] Connect => A new connection has been established')

});

const coordinates = [
    { sensor: 1, latitude: -15.80028100253557, longitude: -46.01022300110646 },
    { sensor: 2, latitude: -15.86671780683419, longitude: -46.19604709506429 },
    { sensor: 3, latitude: -15.852270775231188, longitude: -46.16143289686479 },
    { sensor: 4, latitude: -15.922914504562462, longitude: -46.05554858991217 }
]

function SimpleMap() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    
    socket.on('res.previous_sensor', (data) => {

      
        setSensorData(data)
      
         
      
    })



    }, []);

  

    socket.emit('req.sensor', {
      id: 2,
      message: 'tal'
    })

    socket.on('res.sensor', data => {


      let sensores = sensorData.filter(function (el) {
          return el.sensor != data.sensor;
      });
      sensores = [...sensores, data]
  
      setSensorData(sensores)

     
      
    })

    

  

 

  

  const defaultProps = {
    center: {
      lat: -15.922914504562462,
      lng: -46.05554858991217
    },
    zoom: 11
  };
 
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDFEVR21PUndmkFOqjv0gC-VPjecrL3NzY" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          
        {sensorData && sensorData.map((point) => (
          <PlacesDetected
            // key={}
            lat={point.latitude}
            lng={point.longitude}
            text={point.sensor}
          />
        ))}

        </GoogleMapReact>
      </div>
    );
}
 
export default SimpleMap;