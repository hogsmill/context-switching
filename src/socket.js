import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3003'
} else {
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}

console.log('Connecting to: ' + connStr)
const socket = io(connStr)

socket.on('connect_error', (err) => { bus.$emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

// Send

bus.$on('sendSetContext', (data) => { socket.emit('sendSetContext', data) })

bus.$on('sendMakeMeController', (data) => { socket.emit('sendMakeMeController', data) })

bus.$on('sendStart', (data) => { socket.emit('sendStart', data) })

bus.$on('sendStop', (data) => { socket.emit('sendStop', data) })

bus.$on('sendAddTopicValue', (data) => { socket.emit('sendAddTopicValue', data) })

// Receive

socket.on('setContext', (data) => { bus.$emit('setContext', data) })

socket.on('makeMeController', (data) => { bus.$emit('makeMeController', data) })

socket.on('contexts', (data) => { bus.$emit('contexts', data) })

socket.on('start', (data) => { bus.$emit('start', data) })

socket.on('stop', (data) => { bus.$emit('stop', data) })

socket.on('setTopics', (data) => { bus.$emit('setTopics', data) })

socket.on('enter', (data) => { bus.$emit('enter', data) })

socket.on('tick', (data) => { bus.$emit('tick', data) })

socket.on('addTopicValue', (data) => { bus.$emit('addTopicValue', data) })

// Facilitator

//socket.on('loadEditingGame', (data) => { bus.$emit('loadEditingGame', data) })

export default bus
