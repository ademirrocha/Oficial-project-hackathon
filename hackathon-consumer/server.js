const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group' })

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
	res.render('index.html')
})

let messeges = []

const run = async() => {

   await consumer.connect()
      await consumer.subscribe({ topic: 'noise-json-sensor', fromBeginning: true })
     
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        	console.log(JSON.parse(message.value.toString()))
        	messeges.push({
	            partition,
	            offset: message.offset,
	            value: JSON.parse(message.value.toString()),
	        })
		
        	io.in("real_time").emit("receivedMessage", {
	            partition,
	            offset: message.offset,
	            value: JSON.parse(message.value.toString()),
	        });

          console.log({
            partition,
            offset: message.offset,
            value: JSON.parse(message.value.toString()),
          })
        },
      })
      
}

io.on('connection', async socket => {
	socket.on('room', function(room) {
		console.log('room', room)
        socket.join(room);
    });

	console.log('Socket conectado: ', socket.id)

	socket.emit('previousMessages', messeges)
	

})

run().catch(console.error)

server.listen(3000)

