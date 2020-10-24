const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const logFile = process.argv[4]

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


const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false

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

  socket.on('context', (data) => { emit('context', data) })

  socket.on('contexts', (data) => { emit('contexts', data) })

  socket.on('start', (data) => { emit('start', data) })

  socket.on('stop', (data) => { emit('stop', data) })

  socket.on('setTopics', (data) => { emit('setTopics', data) })

  socket.on('enter', (data) => { emit('enter', data) })

  socket.on('noSwitchTick', (data) => { emit('noSwitchTick', data) })

  socket.on('switchTick', (data) => { emit('switchTick', data) })
})

const port = process.argv[2] || 3003

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
