<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>

    <div v-if="showAbout">
      <AboutView />
    </div>

    <GameName />

    <div v-if="!showAbout">
      <h1>Context Switching (Host: {{isHost}})</h1>
      <div class="container">
        <div class="row">

          <div class="col no-switching">
            <h2>No Context Switching</h2>
            <h3>{{getTime(contexts.noSwitching)}} <button id="go-no-switch" class="btn btn-info" @click="goNoSwitch($event)">Go</button></h3>
            <h4>{{countItems(contexts.noSwitching)}} Items</h4>
            <h3>Think of things that are: </h3>
            <div class="row">
              <div v-for="(topic, topicIndex) in contexts.noSwitching.topics" :key="topicIndex"
                class="col no-switch"
                :class="{active : topic.active}">
                <h4>{{topic.topic}}</h4>
                <input type="text" disabled="true" tabindex="-1"
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
            <h3>{{getTime(contexts.switching)}} <button id="go-switch" class="btn btn-info" @click="goSwitch($event)">Go</button></h3>
            <h4>{{countItems(contexts.switching)}} Items</h4>
            <h3>Think of things that are: </h3>
            <div class="row">
              <div v-for="(topic, topicIndex) in contexts.switching.topics" :key="topicIndex"
                class="col rounded switch"
                :class="{active : topic.active}">
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

  </div>
</template>

<script>
import io from "socket.io-client";

import params from './lib/params.js'

import Header from "./components/Header.vue";
import AboutView from "./components/about/AboutView.vue";

import GameName from "./components/GameName.vue";

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    GameName
  },
  data() {
    return {
      //gameName: '',
      starter: {noSwitch: false, switch: false},
      topics: 3,
      timePerTopic: 20,
      topicsList: [
        "Red", "Alive", "Square",
        "Dead", "Insect", "Cold"
      ],
      contexts: {
        noSwitching: {
          time: 0,
          goButton: "go-no-switch",
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
          goButton: "go-switch",
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
      var gameName = document.getElementById('game-name').value
      this.$store.dispatch("updateGameName", gameName)
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
        this.emit("enter", { topic: topic })
        document.getElementsByClassName('switching-input')[topic].focus()
      }
    },
    _enter: function(n) {
      for (var i = 0; i < 3; i++) {
        if (i == n) {
          this.contexts.switching.topics[i].active = true
        } else {
          this.contexts.switching.topics[i].active = false
        }
      }
      document.getElementsByClassName('switching-input')[n].focus()
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
      this.emit("contexts", this.contexts)
    },
    start: function(context) {
      context.time = 0
      this.emit("start", context)
    },
    _start: function(context) {
      var inputs = document.getElementsByClassName(context.inputs)
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false
      }
      document.getElementById(context.goButton).disabled = true
    },
    stop: function(context) {
      this.emit("stop", context)
    },
    _stop: function(context) {
      var inputs = document.getElementsByClassName(context.inputs)
      for (var i = 0; i < inputs.length; i++) {
        context.topics[i].active = false
        inputs[i].disabled = true
      }
      document.getElementById(context.goButton).disabled = false
    },

    emit: function(action, data) {
      if (! data) {
        data = {}
      }
      data.gameName = this.gameName
      this.socket.emit(action, data)
    },

    // No Switching

    goNoSwitch: function() {
      var context = this.contexts.noSwitching
      this.start(context)
      this.starter.noSwitch = true
      this.getTopics(context)
      this.emit("noSwitchTick", {time: 0})
    },
    _goNoSwitch: function(time) {
      var context = this.contexts.noSwitching
      context.time = time
      if (context.time >= 60) {
        this.starter.noSwitch = false
        this.stop(context)
      } else {
        var rem = context.time % this.timePerTopic
        if (rem == 0) {
          for (var i = 0; i < this.topics; i++) {
            context.topics[i].active = false
          }
          var col = context.time / this.timePerTopic
          context.topics[col].active = true
          document.getElementsByClassName('no-switching-input')[col].focus()
        }
      }
      if (this.starter.noSwitch && context.time < 60) {
        var self = this
        setTimeout(function() { self.emit("noSwitchTick", {time: context.time + 1}) }, 1000)
      }
    },

    // Switching

    goSwitch: function() {
      var context = this.contexts.switching
      this.start(context)
      this.starter.switch = true
      this.getTopics(context)
      this.emit("switchTick", {time: 0})
    },
    _goSwitch: function(time) {
      var context = this.contexts.switching
      context.time = time
      if (time == 0) {
        context.topics[0].active = true
        document.getElementsByClassName('switching-input')[0].focus()
      }
      if (context.time >= 60) {
        this.starter.switch = false
        this.stop(context)
      }
      if (this.starter.switch && context.time < 60) {
        var self = this
        setTimeout(function() { self.emit("switchTick", {time: context.time + 1}) }, 1000)
      }
    }

  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
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
    if (params.isParam("host")) {
      this.$store.dispatch("updateHost", true)
    }
    if (params.getParam("game")) {
      this.$store.dispatch("updateGameName", params.getParam("game"))
    }

    this.socket.on("contexts", (data) => {
      if (data.gameName == this.gameName) {
        this.contexts = data
      }
    })
    this.socket.on("start", (data) => {
      if (data.gameName == this.gameName) {
        this._start(data)
      }
    })
    this.socket.on("stop", (data) => {
      if (data.gameName == this.gameName) {
        this._stop(data)
      }
    })
    this.socket.on("enter", (data) => {
      if (data.gameName == this.gameName) {
        this._enter(data.topic)
      }
    })
    this.socket.on("noSwitchTick", (data) => {
      if (data.gameName == this.gameName) {
        this._goNoSwitch(data.time)
      }
    })
    this.socket.on("switchTick", (data) => {
      if (data.gameName == this.gameName) {
        this._goSwitch(data.time)
      }
    })
  }
}
</script>

<style>
 .active { background-color: yellow; }
</style>
