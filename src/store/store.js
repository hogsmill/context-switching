import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    showAbout: false,
    walkThrough: false,
    host: false,
    gameName: '',
    starter: {noSwitch: false, switch: false},
    topics: 3,
    timePerTopic: 20,
    topicsList: [
      'Red', 'Alive', 'Square', 'Animal', 'Place',
      'Dead', 'Insect', 'Cold', 'Wet', 'Big', 'Far Away',
      'Green', 'Unpleasant', 'Smelly', 'Hot', 'Food',
      'Drink', 'Expensive', 'Small'
    ],
    contexts: {
      noSwitching: {
        time: 0,
        goButton: 'go-no-switch',
        switching: false,
        inputs: 'no-switching-input',
        topics: [
          {topic: '', active: false, items: []},
          {topic: '', active: false, items: []},
          {topic: '', active: false, items: []}
        ]
      },
      switching: {
        switching: true,
        time: 0,
        goButton: 'go-switch',
        inputs: 'switching-input',
        topics: [
          {topic: '', active: false, items: []},
          {topic: '', active: false, items: []},
          {topic: '', active: false, items: []}
        ]
      }
    }
  },
  getters: {
    getShowAbout: (state) => {
      return state.showAbout
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHost: (state) => {
      return state.host
    },
    getGameName: (state) => {
      return state.gameName
    },
    getStarterNoSwitch: (state) => {
      return state.starter.noSwitch
    },
    getStarterSwitch: (state) => {
      return state.starter.switch
    },
    getTopics: (state) => {
      return state.topics
    },
    getTimePerTopic: (state) => {
      return state.timePerTopic
    },
    getTopicsList: (state) => {
      return state.topicsList
    },
    getContexts: (state) => {
      return state.contexts
    }
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    updateStarterNoSwitch: (state, payload) => {
      state.starter.noSwitch = payload
    },
    updateStarterSwitch: (state, payload) => {
      state.starter.switch = payload
    },
    updateTime: (state, payload) => {
      state.contexts[payload.context].time = payload.time
    },
    updateTopics: (state, payload) => {
      for (let i = 0; i < 3; i++) {
        state.contexts[payload.context].topics[i].topic = payload.topics[i]
      }
    },
    updateTopicActive: (state, payload) => {
      state.contexts[payload.context].topics[payload.topic].active = payload.active
    },
    updateTopicItems: (state, payload) => {
      state.contexts[payload.context].topics[payload.topic].items = payload.items
    },
    updateContext: (state, payload) => {
      state.contexts[payload.name] = payload.context
    },
    updateContexts: (state, payload) => {
      state.contexts = payload
    }
  },
  actions: {
    updateShowAbout: ({ commit }, payload) => {
      commit('updateShowAbout', payload)
    },
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    updateStarterNoSwitch: ({ commit }, payload) => {
      commit('updateStarterNoSwitch', payload)
    },
    updateStarterSwitch: ({ commit }, payload) => {
      commit('updateStarterSwitch', payload)
    },
    updateTime: ({ commit }, payload) => {
      commit('updateTime', payload)
    },
    updateTopics: ({ commit }, payload) => {
      commit('updateTopics', payload)
    },
    updateTopicActive: ({ commit }, payload) => {
      commit('updateTopicActive', payload)
    },
    updateTopicItems: ({ commit }, payload) => {
      commit('updateTopicItems', payload)
    },
    updateContexts: ({ commit }, payload) => {
      commit('updateContexts', payload)
    }
  }
})
