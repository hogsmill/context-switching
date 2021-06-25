import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function getContext(state, context) {
  return context == 'switching' ? state.switching : state.noSwitching
}

export const store = new Vuex.Store({
  state: {
    thisGame: 'Context Switching',
    appType: 'Context Switching',
    connectionError: null,
    localStorageStatus: true,
    showAbout: false,
    walkThrough: false,
    host: false,
    gameName: '',
    controller: '',
    context: '',
    running: false,
    topics: 3,
    timePerTopic: 20,
    noSwitching: {
      active: 0,
      topics: [
        {topic: '', active: false, items: []},
        {topic: '', active: false, items: []},
        {topic: '', active: false, items: []}
      ]
    },
    switching: {
      active: 0,
      topics: [
        {topic: '', active: false, items: []},
        {topic: '', active: false, items: []},
        {topic: '', active: false, items: []}
      ]
    }
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    lsSuffix: (state) => {
      // TODO: Switch on appType a la No Estimates
      return 'cs'
    },
    appType: (state) => {
      return state.appType
    },
    getLocalStorageStatus: (state) => {
      return state.localStorageStatus
    },
    getConnectionError: (state) => {
      return state.connectionError
    },
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
    getContext: (state) => {
      return state.context
    },
    getController: (state) => {
      return state.controller
    },
    getSwitchingItems: (state) => {
      return parseInt(
        state.switching.topics[0].items.length +
        state.switching.topics[1].items.length +
        state.switching.topics[2].items.length)
    },
    getNoSwitchingItems: (state) => {
      return parseInt(
        state.noSwitching.topics[0].items.length +
        state.noSwitching.topics[1].items.length +
        state.noSwitching.topics[2].items.length)
    },
    getRunning: (state) => {
      return state.running
    },
    getNoOfItems: (state) => {
      const context = getContext(state, state.context)
      let n = 0
      for (let i = 0; i < context.topics; i++) {
        n = n + context.topics[i].length
      }
      return n
    },
    getTopics: (state) => {
      return getContext(state, state.context).topics
    },
    getActiveTopic: (state) => {
      return getContext(state, state.context).active
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
    updateAppType: (state, payload) => {
      state.appType = payload
      state.thisGame = payload
    },
    localStorageStatus: (state, payload) => {
      state.localStorageStatus = payload
    },
    updateConnectionError: (state, payload) => {
      state.connectionError = payload
    },
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
    makeMeController: (state, payload) => {
      state.controller = payload
    },
    updateContext: (state, payload) => {
      state.context = payload.context
    },
    updateRunning: (state, payload) => {
      state.running = payload
    },
    updateTopics: (state, payload) => {
      const context = getContext(state, payload.context)
      const topics = []
      for (let i = 0; i < context.topics.length; i++) {
        const topic = context.topics[i]
        topic.topic = payload.topics[i]
        topic.items = []
        topics.push(topic)
      }
      state[payload.context].topics = topics
    },
    updateActiveTopic: (state, payload) => {
      state[payload.context].active = payload.topic
    },
    addTopicValue: (state, payload) => {
      const context = getContext(state, payload.context)
      const topics = []
      for (let i = 0; i < context.topics.length; i++) {
        const topic = context.topics[i]
        if (i == payload.topic) {
          const items = topic.items
          items.push(payload.value)
          topic.items = items
        }
        topics.push(topic)
      }
      state[payload.context].topics = topics
    }
  },
  actions: {
    updateAppType: ({ commit }, payload) => {
      commit('updateAppType', payload)
    },
    localStorageStatus: ({ commit }, payload) => {
      commit('localStorageStatus', payload)
    },
    updateConnectionError: ({ commit }, payload) => {
      commit('updateConnectionError', payload)
    },
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
    makeMeController: ({ commit }, payload) => {
      commit('makeMeController', payload)
    },
    updateContext: ({ commit }, payload) => {
      commit('updateContext', payload)
    },
    updateRunning: ({ commit }, payload) => {
      commit('updateRunning', payload)
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
    updateActiveTopic: ({ commit }, payload) => {
      commit('updateActiveTopic', payload)
    },
    updateTopicItems: ({ commit }, payload) => {
      commit('updateTopicItems', payload)
    },
    addTopicValue: ({ commit }, payload) => {
      commit('addTopicValue', payload)
    },

  }
})
