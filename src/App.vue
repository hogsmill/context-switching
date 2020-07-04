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
                  class="form-control no-switching-input"
                  v-on:keyup.enter="enter($event, topicIndex)" />
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
                  class="form-control switching-input"
                  v-on:keyup.enter="enter($event, topicIndex)"/>
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
      currentContext: ''
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
    inputs: function() {
      return document.getElementsByClassName(this.contexts[this.currentContext].inputs)
    },
    goButton: function() {
      return document.getElementById(this.contexts[this.currentContext].goButton)
    },
    setTime: function(time) {
      this.$store.dispatch("updateTime", {context: this.currentContext, time: time})
    },
    setTopicActive(n, active) {
      if (active) {
        this.inputs()[n].focus()
      }
      this.$store.dispatch("updateTopicActive", {context: this.currentContext, topic: n, active: active})
    },
    enter: function(event, topic) {
      this.emit("enter", { context: this.currentContext, topic: topic, value: event.target.value })
      event.target.value = ''
    },
    _enter: function(data) {
      var items = this.contexts[data.context].topics[data.topic].items
      items.push(data.value)
      this.$store.dispatch("updateTopicItems", {context: data.context, topic: data.topic, items: items})
      if (data.context == "switching") {
        var topic = data.topic == 2 ? 0 : data.topic + 1
        for (var i = 0; i < 3; i++) {
          if (i == topic) {
            this.setTopicActive(i, true)
          } else {
            this.setTopicActive(i, false)
          }
        }
      }
    },
    countItems: function(context) {
      var n = 0
      for (var i = 0; i < context.topics.length; i++) {
        n += context.topics[i].items.length
      }
      return n
    },
    getTopics: function() {
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
      this.emit("setTopics", {context: this.currentContext, topics: topics})
    },
    _setTopics: function(data) {
      this.$store.dispatch("updateTopics", {context: data.context, topics: data.topics})
    },
    setContext: function(data) {
      this.$store.dispatch("updateContext", {name: data.contextName, context: data.context})
      this.contextName = data.contextName
      this.context = data.context
    },
    start: function() {
      this.emit("start", {context: this.currentContext})
    },
    _start: function(context) {
      this.currentContext = context
      this.setTime(0)
      var inputs = this.inputs()
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false
      }
      this.goButton().disabled = true
    },
    stop: function() {
      this.emit("stop", {context: this.currentContext})
    },
    _stop: function() {
      var inputs = this.inputs()
      for (var i = 0; i < inputs.length; i++) {
        this.setTopicActive(i, false)
        inputs[i].disabled = true
      }
      this.goButton().disabled = false
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
      this.currentContext = 'noSwitching'
      this.start()
      this.$store.dispatch("updateStarterNoSwitch", true)
      this.getTopics()
      this.emit("noSwitchTick", {context: this.currentContext, time: 0})
    },
    _goNoSwitch: function(time) {
      this.setTime(time)
      if (this.time >= 60) {
        this.$store.dispatch("updateStarterNoSwitch", false)
        this.stop()
      } else {
        var rem = this.time % this.timePerTopic
        if (rem == 0) {
          for (var i = 0; i < this.topics; i++) {
            this.setTopicActive(i, false)
          }
          var col = this.time / this.timePerTopic
          this.setTopicActive(col, true)
        }
      }
      if (this.starterNoSwitch && this.time < 60) {
        var data = {context: this.currentContext, time: this.time + 1}
        var self = this
        setTimeout(function() { self.emit("noSwitchTick", data) }, 1000)
      }
    },

    // Switching

    goSwitch: function() {
      this.currentContext = 'switching'
      this.context = this.contexts.noSwitching
      this.start()
      this.$store.dispatch("updateStarterSwitch", true)
      this.getTopics()
      this.emit("switchTick", {context: this.currentContext, time: 0})
    },
    _goSwitch: function(time) {
      this.setTime(time)
      if (this.time == 0) {
        this.setTopicActive(0, true)
      }
      if (this.time >= 60) {
        this.$store.dispatch("updateStarterSwitch", false)
        this.stop()
      }
      if (this.starterSwitch && this.time < 60) {
        var data = {context: this.currentContext, time: this.time + 1}
        var self = this
        setTimeout(function() { self.emit("switchTick", data) }, 1000)
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
    },
    starterNoSwitch() {
      return this.$store.getters.getStarterNoSwitch
    },
    starterSwitch() {
      return this.$store.getters.getStarterSwitch
    },
    topics() {
      return this.$store.getters.getTopics
    },
    timePerTopic() {
      return this.$store.getters.getTimePerTopic
    },
    topicsList() {
      return this.$store.getters.getTopicsList
    },
    contexts() {
      return this.$store.getters.getContexts
    },
    time() {
      return this.$store.getters.getContexts[this.currentContext].time
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

    this.socket.on("context", (data) => {
      if (data.gameName == this.gameName) {
        this.$store.dispatch("updateContext", data)
      }
    })
    this.socket.on("contexts", (data) => {
      if (data.gameName == this.gameName) {
        this.$store.dispatch("updateContexts", data)
      }
    })
    this.socket.on("start", (data) => {
      if (data.gameName == this.gameName) {
        this._start(data.context)
      }
    })
    this.socket.on("stop", (data) => {
      if (data.gameName == this.gameName) {
        this._stop()
      }
    })
    this.socket.on("setTopics", (data) => {
      if (data.gameName == this.gameName) {
        this._setTopics(data)
      }
    })
    this.socket.on("enter", (data) => {
      if (data.gameName == this.gameName) {
        this._enter(data)
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
 .switch, .no-switch { padding-bottom: 6px; }
 .active { background-color: yellow; }
</style>
