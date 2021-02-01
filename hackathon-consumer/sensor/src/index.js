const express = require('express')
const path = require('path')

const app = express()

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      next()
    });


const server = require('http').createServer(app)


const io = require('socket.io')(server)

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group' })

let messeges = []

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
          }
          
           io.in("real_time").emit("res.sensor", sensor);

         messeges = messeges.filter(function (el) {
                return el.sensor != sensor.sensor;
              });

          messeges.push(sensor)

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

  socket.emit('res.previous_sensor', messeges)

  socket.on('disconnect', () => {
    console.log('[SOCKET] Disconnect => A connection was disconnected')
  })
  

})

run().catch(console.error)

server.listen(8080)

