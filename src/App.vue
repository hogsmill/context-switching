<template>
  <div id="app" class="mb-4">
    <nav class="navbar navbar-expand-lg navbar-light mb-4">
      <a class="navbar-brand" href="http://agilesimulations.co.uk">
        <img src="/lego.png" class="ml-4" height="38px" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" :class="{ active: !showAbout }">
            <a class="nav-link pointer" @click="showAbout = false"
              >Simulation</a
            >
          </li>
          <li class="nav-item" :class="{ active: showAbout }">
            <a class="nav-link pointer" @click="showAbout = true">About</a>
          </li>
        </ul>
      </div>
    </nav>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div class="game-name text-right">
      <button class="btn btn-sm btn-info" v-if="!gameName" @click="show">Set Game Name</button>
      <span v-if="gameName">Game: {{gameName}}</span>
    </div>
    <div v-if="!showAbout">
      <h1>Context Switching</h1>
      <div class="container">
        <div class="row">

          <div class="col no-switching">
            <h2>No Context Switching</h2>
            <h3>{{getTime(contexts.noSwitching)}} <button class="btn btn-info" @click="goNoSwitch($event)">Go</button></h3>
            <h4>{{countItems(contexts.noSwitching)}} Items</h4>
            <h3>Think of things that are: </h3>
            <div class="row">
              <div v-for="(topic, topicIndex) in contexts.noSwitching.topics" :key="topicIndex"
                class="col no-switch"
                :class="{active : topic.active}">
                <h4>{{topic.topic}}</h4>
                <input type="text" disabled="true"
                  v-model="contexts.noSwitching.topics[topicIndex].newValue"
                  class="form-control no-switching-input"
                  v-on:keyup.enter="enter(contexts.noSwitching, topicIndex)"/>
                <div v-for="(item, itemIndex) in topic.items" :key="itemIndex">
                  {{item}}
                </div>
              </div>
            </div>
          </div>

          <div class="col switching">
            <h2>Context Switching</h2>
            <h3>{{getTime(contexts.switching)}} <button class="btn btn-info" @click="goSwitch($event)">Go</button></h3>
            <h4>{{countItems(contexts.switching)}} Items</h4>
            <h3>Think of things that are: </h3>
            <div class="row">
              <div v-for="(topic, topicIndex) in contexts.switching.topics" :key="topicIndex" class="col rounded switch">
                <h4>{{topic.topic}}</h4>
                <input type="text" disabled="true"
                  v-model="contexts.switching.topics[topicIndex].newValue"
                  class="form-control switching-input"
                  v-on:keyup.enter="enter(contexts.switching, topicIndex)"/>
                <div v-for="(item, itemIndex) in topic.items" :key="itemIndex">
                  {{item}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal name="set-game-name" :height="120" :classes="['rounded']">
      <div class="text-right"><span @click="hide" class="glyphicon glyphicon-star">x</span></div>
      <h4>Enter Your Game Name</h4>
      <div class="set-game-name">
        <input type="text" id="game-name" class="form-control" />
        <button class="btn btn-sm btn-info" @click="saveGameName">Save</button>
      </div>
    </modal>

  </div>
</template>

<script>
import io from "socket.io-client";

import AboutView from "./components/about/AboutView.vue";

export default {
  name: 'App',
  components: {
    AboutView
  },
  data() {
    return {
      gameName: '',
      starter: {noSwitch: false, switch: false},
      showAbout: false,
      host: false,
      topics: 3,
      timePerTopic: 20,
      topicsList: [
        "Red", "Alive", "Square",
        "Dead", "Insect", "Cold"
      ],
      contexts: {
        noSwitching: {
          time: 0,
          switching: false,
          inputs: 'no-switching-input',
          topics: [
            {topic: "", active: false, items: []},
            {topic: "", active: false, items: []},
            {topic: "", active: false, items: []}
          ]
        },
        switching: {
          switching: true,
          time: 0,
          inputs: 'switching-input',
          topics: [
            {topic: "", active: false, items: []},
            {topic: "", active: false, items: []},
            {topic: "", active: false, items: []}
          ]
        }
      }
    }
  },
  methods: {
    show () {
      this.$modal.show('set-game-name');
    },
    hide () {
      this.$modal.hide('set-game-name');
    },
    saveGameName: function() {
      this.gameName = document.getElementById('game-name').value
      this.hide()
    },
    getTime: function(context) {
      var minutes = parseInt(context.time / 60)
      var seconds = context.time - (minutes * 60)
      if (minutes < 10) { minutes = '0' + minutes }
      if (seconds < 10) { seconds = '0' + seconds }
      return minutes + ':' + seconds
    },
    enter: function(context, topic) {
      context.topics[topic].items.push(context.topics[topic].newValue)
      context.topics[topic].newValue = ''
      this.socket.emit("contexts", this.contexts)
      if (context.switching) {
        topic = topic == 2 ? 0 : topic + 1
        document.getElementsByClassName('switching-input')[topic].focus()
      }
    },
    countItems: function(context) {
      var n = 0
      for (var i = 0; i < context.topics.length; i++) {
        n += context.topics[i].items.length
      }
      return n
    },
    getTopics: function(context) {
      var topics = []
      var l = this.topicsList.length
      while (topics.length < 3) {
        var rand = Math.floor(Math.random() * l)
        var topic = this.topicsList[rand]
        var dupe = false
        for (var j = 0; j < topics.length; j++) {
          if (topic == topics[j]) {
            dupe = true
          }
        }
        if (!dupe) {
          topics.push(topic)
        }
      }
      for (var i = 0; i < this.topics; i++) {
        context.topics[i].topic = topics[i]
      }
    },
    storeGo: function(context, button) {
      context.goButton = button
    },
    start: function(context) {
      context.time = 0
      var inputs = document.getElementsByClassName(context.inputs)
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false
      }
      context.goButton.disabled = true
    },
    stop: function(context) {
      var inputs = document.getElementsByClassName(context.inputs)
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true
      }
      context.goButton.disabled = false
      context.time = 0
    },

    emit: function(action, data) {
      if (! data) {
        data = {}
      }
      data.gameName = this.gameName
      this.socket.emit(action, data)
    },

    // No Switching

    goNoSwitch: function(event) {
      var context = this.contexts.noSwitching
      this.storeGo(context, event.target)
      this.start(context)
      this.starter.noSwitch = true
      this.getTopics(context)
      this.emit("noSwitchTick")
    },
    _goNoSwitch: function() {
      var context = this.contexts.noSwitching
      var rem = context.time % this.timePerTopic
      if (rem == 0) {
        for (var i = 0; i < this.topics; i++) {
          context.topics[i].active = false
        }
        var col = context.time / this.timePerTopic
        context.topics[col].active = true
        document.getElementsByClassName('no-switching-input')[col].focus()
      }
      context.time = context.time + 1
      if (context.time < 60 &&this.starter) {
        this.emit("noSwitchTick")
      } else {
        this.starter.noSwitch = false
        this.stop(context)
      }
    },

    // Switching

    goSwitch: function(event) {
      var context = this.contexts.switching
      this.storeGo(context, event.target)
      this.start(context)
      this.starter.noSwitch = true
      this.getTopics(context)
      document.getElementsByClassName('switching-input')[0].focus()
      this.socket.emit("switchTick")
    },
    _goSwitch: function() {
      var context = this.contexts.switching
      context.time = context.time + 1
      if (context.time < 60 && this.starter.noSwitch) {
        this.socket.emit("switchTick")
      } else {
        this.starter.noSwitch = false
        this.stop(context)
      }
    }

  },
  created() {
    var host = "77.68.122.69"
      if (location.hostname == 'localhost') {
        host = 'localhost'
      }
      var connStr = "http://" + host + ":3003"
      console.log("Connecting to: " + connStr)
      this.socket = io(connStr)
  },
  mounted() {
    if (location.search == "?host") {
      this.host = true
    }
    this.socket.on("contexts", (data) => {
      if (data.gameName == this.gameName) {
        this.contexts = data
      }
    })
    this.socket.on("noSwitchTick", (data) => {
      if (data.gameName == this.gameName) {
        setTimeout(this._goNoSwitch, 1000)
      }
    })
    this.socket.on("switchTick", (data) => {
      if (data.gameName == this.gameName) {
        setTimeout(this._goSwitch, 1000)
      }
    })
  }
}
</script>

<style>
.active {
  background-color: yellow;
}
</style>
