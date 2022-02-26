<template>
  <div class="explain">
    <button
      v-if="!showAbout"
      class="btn btn-sm btn-info"
      @click="help"
    >
      Explain this for me...
    </button>
  </div>
</template>

<script>
import params from '../../lib/params.js'

import Facilitation from './Facilitation.vue'

export default {
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    help() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>

<style lang="scss">
  .explain {
    display: inline-block;
    margin: 2px 6px;
  }

  .buttons {
    padding: 6px;
  }
</style>
