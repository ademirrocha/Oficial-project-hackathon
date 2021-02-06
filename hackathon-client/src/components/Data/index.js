import React, {useState, useEffect} from 'react';
import socket from '../../config/socket-io.js'

var room = "room_two_hours";

socket.on('connect', function() {
       // Connected, let's sign-up for to receive messages for this room
       socket.emit('room', room);
       console.log('[IO] Connect => A new connection has been established')

   });


function DataBarChart(){

	socket.on('res.bar_chart_sensor', (data) => {
		return  data;
	})
}

export default DataBarChart;