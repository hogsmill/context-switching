<template>
  <div class="game-name" v-if="!showAbout">
    <div class="game-name">
      <button class="btn btn-sm btn-info" @click="show">
        Set Game Name
      </button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    show () {
      this.$store.dispatch('showModal', 'setGame')
    }
  }
}
</script>

<style lang="scss">
  .game-name {
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
