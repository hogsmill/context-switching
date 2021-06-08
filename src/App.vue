<template>
  <div id="app" class="mb-4">
    <appHeader />
    <GameName />
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout && !gameName" class="plates" />
    <div v-if="!showAbout && gameName">
      <h1>Game: {{ gameName }} <i class="fas fa-undo" @click="restart()" /></h1>
      <div class="container">
        <div v-if="gameName" class="context">
          <div>
            <Control :game="'switching'" />
            <Control :game="'noSwitching'" />
          </div>
        </div>
        <div class="row">
          <Panel />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'

import GameName from './components/GameName.vue'
import Control from './components/Control.vue'
import Panel from './components/Panel.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    WalkThroughView,
    GameName,
    Control,
    Panel
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
    context() {
      return this.$store.getters.getContext
    },
    switchingItems() {
      return this.$store.getters.getSwitchingItems
    },
    noSwitchingItems() {
      return this.$store.getters.getNoSwitchingItems
    },
    running() {
      return this.$store.getters.getRunning
    }
  },
  mounted() {
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }
    if (params.getParam('game')) {
      this.$store.dispatch('updateGameName', params.getParam('game'))
    }

    bus.$on('setContext', (data) => {
      if (data.gameName == this.gameName) {
        this.$store.dispatch('updateContext', data)
      }
    })
  },
  methods: {
    show () {
      this.$modal.show('set-game-name')
    },
    hide () {
      this.$modal.hide('set-game-name')
    },
    saveGameName: function() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      this.hide()
    },
    setContext(context) {
      bus.$emit('sendSetContext', {gameName: this.gameName, context: context})
    },
    restart() {
      console.log('restarting')
    }
  }
}
</script>

<style lang="scss">
  .context {
    text-align: center;
    margin-bottom: 24px;
  }

  .fa-undo {
    font-size: smaller;
    color: #888;

    &:hover {
      color: #444;
    }
  }

  .plates {
    margin: 36px auto 0 auto;
    height: 450px;
    width: 800px;
    max-width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: top;
    background-image: url("./assets/img/plates.png");
  }
</style>
