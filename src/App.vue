<template>
  <div id="app" class="mb-4">
    <h1>Context Switching</h1>
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>No Context Switching</h2>
          <h3>{{getTime(noSwitching)}}</h3>
          <h3>Think of things that are: </h3>
          <div class="row">
            <div v-for="(topic, topicIndex) in noSwitching.topics" :key="topicIndex" class="col">
              <h4>{{topic.topic}}</h4>
              <input type="text" v-model="noSwitching.topics[topicIndex].newValue" class="form-control" v-on:keyup.enter="enter(noSwitching, topicIndex)"/>
              <div v-for="(item, itemIndex) in topic.items" :key="itemIndex">
                {{item}}
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <h2>Context Switching</h2>
          <h3>{{getTime(switching)}}</h3>
          <h3>Think of things that are: </h3>
          <div class="row">
            <div v-for="(topic, topicIndex) in switching.topics" :key="topicIndex" class="col">
              <h4>{{topic.topic}}</h4>
              <input type="text" v-model="switching.topics[topicIndex].newValue" class="form-control" v-on:keyup.enter="enter(switching, topicIndex)"/>
              <div v-for="(item, itemIndex) in topic.items" :key="itemIndex">
                {{item}}
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

export default {
  name: 'App',
  components: {},
  data() {
    return {
      host: false,
      noSwitching: {
        time: 0,
        topics: [
          {topic: "Red", items: [1, 2,3 ]},
          {topic: "Large", items: [4, 5, 6]},
          {topic: "Cold", items: [7, 8, 9]}
        ]
      },
      switching: {
        time: 0,
        topics: [
          {topic: "Red", items: [3, 2, 1]},
          {topic: "Large", items: [4, 5, 6]},
          {topic: "Cold", items: [7, 8, 9]}
        ]
      },
    }
  },
  methods: {
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
  }
}
</script>
