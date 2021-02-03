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
      date: DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss')
    }

    io.in("real_time").emit("res.sensor", sensor);

    
    sensorsRealTime = sensorsRealTime.filter(function (el) {
      return el.sensor != sensor.sensor;
    });
    

    sensors.push(sensor)

    console.log(sensor)

  },
})

}

io.on('connection', async socket => {
  socket.on('room', function(room) {
    console.log('room', room)
    socket.join(room);
  });

  console.log('Socket conectado: ', socket.id)

  socket.emit('res.previous_sensor', sensorsRealTime)

  socket.on('disconnect', () => {
    console.log('[SOCKET] Disconnect => A connection was disconnected')
  })
  

})

//run().catch(console.error)

server.listen(8080)

