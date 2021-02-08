const express = require('express')
const path = require('path')
var fs = require("fs");
const { Kafka } = require('kafkajs')

const { DateTime } = require("luxon");
DateTime.local().setZone('America/Sao_Paulo');

let startDate = DateTime.local();


function dataAleatoria() {
  var nowDate = DateTime.local();
  var oldDate = nowDate.minus({hours: 200});
  return DateTime.fromMillis(nowDate.valueOf() + Math.random() * (oldDate.valueOf() - nowDate.valueOf()));
}


const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


const server = require('http').createServer(app)
const io = require('socket.io')(server)



const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})


var all_sockets = []

var sensors = []
var sensorsRealTime = []

if(sensors.length == 0){

  sensors = fs.readFileSync("./data.json" , "utf8");

  var sensors = JSON.parse(sensors); 
  sensors.forEach( (s) => {
    s.date = dataAleatoria().toFormat('yyyy-MM-dd HH:mm:ss')
    s.point_size = parseInt((s.volume + s.frequency)/300) + 'px'
  })

  sensors.sort(function (a, b) {
    return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
  })

  sensors.forEach( (s) => {

    hasMagenicVendor = sensorsRealTime.some( e => e['sensor'] === s['sensor'] )

    if(hasMagenicVendor == false && sensorsRealTime.length < 20){
      sensorsRealTime.push(s)      
    }

  })

}

function average_sensors(calc, item) {
  return  calc + item.volume
}

function getDistanceFromLatLonInKm(position1, position2) {
  "use strict";
  var deg2rad = function (deg) { return deg * (Math.PI / 180); },
  R = 6371,
  dLat = deg2rad(position2.lat - position1.lat),
  dLng = deg2rad(position2.lng - position1.lng),
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
  + Math.cos(deg2rad(position1.lat))
  * Math.cos(deg2rad(position1.lat))
  * Math.sin(dLng / 2) * Math.sin(dLng / 2),
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return ((R * c *1000).toFixed());
}


function getSensorsLastDays(days){

  var result = []
  var sensorsLast = []
  var today = DateTime.fromSQL(DateTime.local().toFormat('yyyy-MM-dd'))
  for (var i=0; i < days; i++){

    sensorsLast = sensors.filter( e =>  DateTime.fromSQL(e['date']).ts < today.minus({hours: parseInt((i * 24)) }).ts && 
      DateTime.fromSQL(e['date']).ts >= today.minus({hours: parseInt(24 + (i * 24)) }).ts  )

    result[i] = {
      date: today.minus({hours:  parseInt(24 + (i * 24) ) }).toFormat('dd/MM/yyyy'),
      average_volume: ( (sensorsLast.reduce(average_sensors, 0)) / sensorsLast.length).toFixed(2)
    }

  }


  return result.reverse()
}


function getSensorsLastMinutes(minutes){

  var result = []
  var sensorsLast = []

  if(DateTime.fromSQL(sensors[0].date).toFormat('HH:mm') != DateTime.local().toFormat('HH:mm')){
    sensors.push({
      latitude: sensors[0].latitude,
      longitude: sensors[0].longitude,
      sensor: sensors[0].sensor,
      frequency: sensors[0].frequency,
      volume: sensors[0].volume,
      point_size: parseInt((sensors[0].volume + sensors[0].frequency)/300) + 'px',
      date: DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss')
    })
  }

  for (var i=0; i < 10; i++){

    sensorsLast = sensors.filter( e =>  DateTime.fromSQL(e['date']).ts < DateTime.local().minus({minutes: parseInt((i * 12)) }).ts && 
      DateTime.fromSQL(e['date']).ts >= DateTime.local().minus({minutes: parseInt(minutes + (i * minutes)) }).ts  )

    result[i] = {
      date: DateTime.local().minus({minutes:  parseInt(minutes + (i * minutes)) }).toFormat('HH:mm') + ' a ' + DateTime.local().minus({minutes: parseInt((i * minutes)) }).toFormat('HH:mm'),
      average_volume: ( (sensorsLast.reduce(average_sensors, 0)) / sensorsLast.length).toFixed(2)
    }

  }

  return result.reverse()
}




const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async() => {

 await consumer.connect()
 await consumer.subscribe({ topic: 'noise-json-sensor', fromBeginning: true })

 await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {

    var sensor = JSON.parse(message.value.toString())

    sensor = {
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      sensor: sensor.sensor,
      frequency: sensor.frequency,
      volume: sensor.volume,
      point_size: parseInt((sensor.volume + sensor.frequency)/300) + 'px',
      date: DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss')
    }

    io.in("real_time").emit("res.sensor", sensor);


    for(var socket in all_sockets){

      var distancia = (getDistanceFromLatLonInKm(
       {lat: all_sockets[socket].latitude, lng: all_sockets[socket].longitude},
       {lat: sensor.latitude, lng: sensor.longitude}
       ));

      console.log(distancia);

      if(distancia <= 1000 && sensor.volume >= 50){

        io.to(all_sockets[socket].id).emit('res.notify', {
          date: DateTime.local().toFormat('dd/MM/yyyy | HH:mm:ss'),
          author: 'Alerta',
          message: 'Você está em uma área onde há uma grande quantidade de poluíção sonora. \nPara não prejudicar sua saúde é recomendado que se afaste para outra localidade.'
        })
      }
    }

    io.in("room_two_hours").emit('res.chart_sensor_last_two_hours', getSensorsLastMinutes(12))
    io.in("room_six_hours").emit('res.chart_sensor_last_six_hours', getSensorsLastMinutes(36))
    io.in("room_twelve_hours").emit('res.chart_sensor_last_twelve_hours', getSensorsLastMinutes(72))
    io.in("room_twenty_four_hours").emit('res.chart_sensor_last_twenty_four_hours', getSensorsLastMinutes(144))
    io.in("room_ten_days").emit('res.chart_sensor_last_ten_days', getSensorsLastDays(10))
    io.in("room_five_days").emit('res.chart_sensor_last_five_days', getSensorsLastDays(5))
    io.in("room_thirty_days").emit('res.chart_sensor_last_thirty_days', getSensorsLastDays(30))
    
    console.log(sensor)
    
    sensorsRealTime = sensorsRealTime.filter(function (el) {
      return el.sensor != sensor.sensor;
    });
    

    sensors.push(sensor)


  },
})

}

io.on('connection', async socket => {

  socket.on('room', async function(room) {

    socket.join(room);

    if(room === 'room_real_time'){
      socket.emit('res.previous_sensor', sensorsRealTime)
    }

    if(room === 'room_two_hours'){
      socket.emit('res.chart_sensor_last_two_hours', getSensorsLastMinutes(12))
    }

    if(room === 'room_six_hours'){
      socket.emit('res.chart_sensor_last_six_hours', getSensorsLastMinutes(36))
    }

    if(room === 'room_twelve_hours'){
      await socket.emit('res.chart_sensor_last_twelve_hours', getSensorsLastMinutes(72))
    }

    if(room === 'room_twenty_four_hours'){
      await socket.emit('res.chart_sensor_last_twenty_four_hours', getSensorsLastMinutes(144))
    }

    if(room === 'room_five_days'){
      await socket.emit('res.chart_sensor_last_five_days', getSensorsLastDays(5))
    }

    if(room === 'room_ten_days'){
      await socket.emit('res.chart_sensor_last_ten_days', getSensorsLastDays(10))
    }

    if(room === 'room_thirty_days'){
      await socket.emit('res.chart_sensor_last_thirty_days', getSensorsLastDays(30))
    }

  });

  socket.on('my_position', function(position){

    console.log(position)
    all_sockets.push({
      id: socket.id,
      latitude: position.latitude,
      longitude: position.longitude,
    })

    
    for(var socket_in in all_sockets){
      console.log('socket_in => ', all_sockets[socket_in])

      if(all_sockets[socket_in].id === socket.id ){
        var res = false
        for(s in sensorsRealTime){

          var distancia = (getDistanceFromLatLonInKm(
           {lat: all_sockets[socket_in].latitude, lng: all_sockets[socket_in].longitude},
           {lat: sensorsRealTime[s].latitude, lng: sensorsRealTime[s].longitude}
           ));

          console.log('sensor => ', sensorsRealTime[s].sensor , ' | distancia => ', distancia, ' volume => ', sensorsRealTime[s].volume);

          if(distancia <= 10000 && sensorsRealTime[s].volume >= 50){

            console.log('sensor => ', sensorsRealTime[s].sensor , ' | distancia => ', distancia, ' volume => ', sensorsRealTime[s].volume);

           res = true
          }

        }


        if(res){

           io.to(all_sockets[socket_in].id).emit('res.notify', {
              date: DateTime.local().toFormat('dd/MM/yyyy | HH:mm:ss'),
              author: 'Alerta',
              message: 'Você está em uma área onde há uma grande quantidade de poluíção sonora. \nPara não prejudicar sua saúde é recomendado que se afaste para outra localidade.'
            })

        }
        
      }
    }

  })

  
  socket.on('disconnect', () => {


  })

  socket.on('forceDisconnectRoom', function(room){

    //socket.disconnect();
    socket.emit('level_disconnected')
    //socket.leave(room);
    
  });
  

})

//run().catch(console.error)

server.listen(8089)

