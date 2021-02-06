const express = require('express')
const path = require('path')
var fs = require("fs");
const { DateTime } = require("luxon");
DateTime.local().setZone('America/Sao_Paulo');

let startDate = DateTime.local();

console.log(startDate.toISODate())
console.log(startDate.toFormat('yyyy-MM-dd HH:mm:ss'))


function dataAleatoria() {
  var nowDate = DateTime.local();
  var oldDate = nowDate.minus({hours: 2});
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
const { Kafka } = require('kafkajs')

/*
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})
*/
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

/*
function getSensorsLastDays(days){

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
      DateTime.fromSQL(e['date']).ts >= DateTime.local().minus({minutes: parseInt(12 + (i * 12)) }).ts  )

    result[i] = {
      date: DateTime.local().minus({minutes:  parseInt(12 + (i * 12)) }).toFormat('HH:mm') + ' a ' + DateTime.local().minus({minutes: parseInt((i * 12)) }).toFormat('HH:mm'),
      average_volume: ( (sensorsLast.reduce(average_sensors, 0)) / sensorsLast.length).toFixed(2)
    }

  }

  console.log('sensorsLast => ', result)

  return result.reverse()
}
*/

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

  //console.log('sensorsLast => ', result)

  return result.reverse()
}




//const consumer = kafka.consumer({ groupId: 'test-group' })

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
    io.in("room_two_hours").emit('res.bar_chart_sensor', getSensorsLastMinutes(12))

    
    sensorsRealTime = sensorsRealTime.filter(function (el) {
      return el.sensor != sensor.sensor;
    });
    

    sensors.push(sensor)


  },
})

}

io.on('connection', async socket => {
  socket.on('room', function(room) {
    console.log('room', room)
    socket.join(room);

    if(room === 'room_real_time'){
      socket.emit('res.previous_sensor', sensorsRealTime)
    }

    if(room === 'room_two_hours'){
      socket.emit('res.bar_chart_sensor', getSensorsLastMinutes(12))
    }

    if(room === 'room_six_hours'){
      socket.emit('res.bar_chart_sensor', getSensorsLastMinutes(36))
    }

  });

  console.log('Socket conectado: ', socket.id)
  
  socket.on('disconnect', () => {
    console.log('[SOCKET] Disconnect => A connection was disconnected')
  })

  socket.on('forceDisconnectRoom', function(room){
    //console.log('lastRoom => ', room)
    //socket.disconnect();
    socket.emit('level_disconnected')
    //socket.leave(room);
    
  });
  

})

//run().catch(console.error)

server.listen(8080)

