<template>
  <vue-final-modal name="set-game" classes="modal-container" content-class="vfm__content modal-content set-game" v-model="modals['setGame']">
    <div class="text-right">
      <span @click="hide" class="glyphicon glyphicon-star">x</span>
    </div>
    <h4>Enter Your Game Name</h4>
    <div class="set-game-name">
      <input type="text" id="game-name" class="form-control">
      <button class="btn btn-sm btn-info" @click="saveGameName">
        Save
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { $vfm, VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'
import mailFuns from '../../lib/mail.js'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      workshopUrl: '',
      gameUrl: ''
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    workshops() {
      return this.$store.getters.getWorkshops
    },
    workshop() {
      return this.$store.getters.getWorkshop
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    players() {
      return this.$store.getters.getPlayers
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  created() {
    this.workshopUrl = params.getParam('workshop')
    this.gameUrl = params.getParam('game')
    if (this.gameUrl) {
      this.workshopUrl = 'None (Single team Game)'
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setGame')
    },
    saveGameName() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      this.hide()
    }
  }
}
</script>

<style lang="scss">

  .set-game {
    table {
      margin: 0 auto;
      td {
        padding: 0 4px;
        height: 40px;

        input, select {
          width: 180px;
          padding: 4px;
          margin-bottom: 8px;
          display: inline-block;
        }
        div {
          text-align: left;
          width: 250px;
        }
        .fas {
          font-size: x-large;
          color: #888;
          display: inline-block;
          margin: 0px 8px;
          position: relative;
          top: 4px;

          &:hover {
            cursor: pointer;
            color: #444;
          }
        }
      }
    }
  }
</style>
