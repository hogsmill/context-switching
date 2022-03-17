<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4" v-if="step == 1">
      <h4>Welcome to Context Switching</h4>
      <div>
        <p>
          This activity demonstrates the effects of context switching,
        </p>
        <p>
          After playing
          this, maybe you'll realise how expensive a 5 minute interruption when a
          developer is "in the zone" actually is...
        </p>
        <Facilitation />
      </div>
    </div>
    <div class="mt-4" v-if="step == 2">
      <h4>Welcome to Context Switching</h4>
      <div>
        <p>
          The game is simple - you get 3 topics, and you have to type in as many
          items in that topic as you can think of in a minute.
        </p>
        <ul>
          <li>
            In the "<em>No Switching</em>" game (on left), the topic changes every
            20 seconds
          </li>
          <li>
            In the "<em>Switching</em>" game (on right), the topic changes every
            time an item is typed in.
          </li>
        </ul>
        <p>
          Players will usually think of more item in the "No Switching" game, as
          they are not context switching
        </p>
      </div>
    </div>
    <div class="mt-4" v-if="step == 3">
      <h4>Game Play</h4>
      <p>
        Simply press "Go", and type in items in the highlighted box.
      </p>
      <p>Note: Press Return, not Tab, to enter items...</p>
    </div>
    <div class="mt-4" v-if="step == 4">
      <h4>Game Play</h4>
      <p>
        If you want to play as a team, simply set the Game Name (top left) to
        the same for each team member before you start the game.
      </p>
    </div>
    <div class="buttons" v-if="step < 4">
      <button class="btn btn-info" @click="incrementStep">
        Next
      </button>
      <button class="btn btn-info" @click="hide()">
        Skip
      </button>
    </div>
    <div class="buttons" v-if="step == 4">
      <button class="btn btn-info" @click="hide()">
        Play Game
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }
  }
</style>
