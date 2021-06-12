<template>
  <div class="controller" v-if="gameName">
    <button class="btn btn-sm btn-info" @click="makeMeController()">
      Make Me Controller
    </button>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../socket.js'

export default {
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    makeMeController() {
      const id = uuidv4()
      this.$store.dispatch('makeMeController', id)
      bus.$emit('sendMakeMeController', {gameName: this.gameName, id: id})
    }
  }
}
</script>

<style lang="scss">
  .controller {
    display: inline-block;
    margin: 2px 6px;

    button {
      font-size: smaller;
      background-color: #aaa;
      border: 1px solid #aaa;

      &:hover {
        color: #aaa;
        background-color: #fff;
      }
    }
  }
</style>
