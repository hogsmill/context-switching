
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'
const port = prod ? process.env.VUE_APP_PORT : 3003

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})


let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 10

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

const running = {}
function start(data, t) {
  if (t == 0) {
    running[data.gameName] = true
  }
  if (running[data.gameName] && t < 60) {
    emit('tick', {gameName: data.gameName, context: data.context, time: t})
    t = t + 1
    setTimeout(() => {
      start(data, t)
    }, 1000)
  } else {
    emit('stop', {gameName: data.gameName, context: data.context})
  }
}

const topicsList = [
  'Red', 'Alive', 'Square', 'an Animal', 'a Place', 'Dead', 'an Insect', 'Cold', 'Wet', 'Big', 'Far Away',
  'Green', 'Unpleasant', 'Smelly', 'Hot', 'a Food', 'a Drink', 'Expensive', 'Small', 'a Multiple of 3', 'Starts with A',
  'a Gadget', 'a TV Programme'
]

function getTopics(data) {
  const found = []
  while (found.length < 3) {
    const topic = topicsList[parseInt(Math.random() * topicsList.length)]
    if (found.indexOf(topic) < 0) {
      found.push(topic)
    }
  }
  data.topics = found
  emit('setTopics', data)
}

io.on('connection', (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
  }

  socket.on('disconnect', () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
  })

  socket.on('sendSetContext', (data) => { emit('setContext', data) })

  socket.on('sendMakeMeController', (data) => { emit('makeMeController', data) })

  socket.on('sendStart', (data) => {
    emit('start', data)
    getTopics(data)
    start(data, 0)
  })

  socket.on('sendStop', (data) => {
    running[data.gameName] = false
    emit('stop', data)
  })

  socket.on('sendSetTopics', (data) => { getTopicsList(data) })

  socket.on('sendAddTopicValue', (data) => { emit('addTopicValue', data) })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
