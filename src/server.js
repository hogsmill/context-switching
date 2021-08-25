
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'
const port = prod ? process.env.VUE_APP_PORT : 3003
const gameCollection =  prod ? process.env.VUE_APP_COLLECTION : 'contextSwitching'

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

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

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

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000
const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 2000

const emit = (event, data) => {
  if (debugOn) {
    console.log(event, data, '(emit)')
  }
  io.emit(event, data)
}

let db
MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, (err, client) => {
  if (err) throw err
  db = client.db('db')

  db.createCollection(gameCollection, function(error, collection) {})

  db.gameCollection = db.collection(gameCollection)

  io.on('connection', (socket) => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] ? connections[connection] + 1 : 1
    if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
      console.log(`Too many connections. Socket ${socket.id} closed`)
      socket.disconnect(0)
    } else {
      connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    }

    socket.on('disconnect', () => {
      const connection = socket.handshake.headers.host
      connections[connection] = connections[connection] - 1
      connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
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
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
