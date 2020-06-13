<template>
  <div class="results">
    <h2>Results</h2>
    <div class="narration"></div>
    <div class="strategies">
      <table>
        <thead>
          <td :style="{ width: setWidth() }">Round</td>
          <td v-for="role in state.rounds[0]['roles']" :key="role['name']" :style="{ width: setWidth() }">{{role['name']}}</td>
          <td :style="{ width: setWidth() }">Delivered</td>
        </thead>
        <tbody>
          <tr v-for="(round, roundIndex) in state.rounds" :key="roundIndex">
            <td>{{round['name']}}</td>
            <td v-for="(role, roleIndex) in state.rounds[0]['roles']" v-bind:role="role" v-bind:roleIndex="roleIndex" :key="roleIndex">
              <div v-if="state.rounds[index]['roles'][roleIndex]">
                <div v-for="(coin, coinIndex) in state['rounds'][roundIndex]['roles'][roleIndex]['coins']" :v-bind:coin="coin" :key="coinIndex" class="coin-parent">
                  <div class="coin" v-bind:class="[getClassName(role), getValueName(coin)]"></div>
                </div>
              </div>
            </td>
            <td>
              <div>£{{value(round['delivered'])}} in {{time(round['time'])}}</div>
              <div v-if="outOfTime(round)" class="missed">Missed delivery</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Results',
  props: ['state'],
  data() {
    return {
      coinClasses: {
        1: 'one-p',
        2: 'two-p',
        5: 'five-p',
        10: 'ten-p',
        20: 'twenty-p',
        50: 'fifty-p',
        100: 'one-pound',
        200: 'two-pound'
      }
    }
  },
  methods: {
    setWidth() {
      return 100 / (this.state['roles'].length + 1) + '%'
    },
    getClassName(role) {
      return role['name'].replace(' ', '-').toLowerCase()
    },
    getValueName(coin) {
      var classStr = this.coinClasses[coin['value']]
      if (coin['played']) {
        classStr = classStr + ' played'
      }
      return classStr
    },
    time(t) {
      var secs = t / 1000
      var minutes = Math.floor(secs / 60)
      secs = Math.floor(secs - minutes * 60)
      if (secs < 10) {
        secs = '0' + secs
      }
      return minutes + ':' + secs
    },
    value(n) {
      var pounds = Math.floor(n / 100)
      var pence = n - pounds * 100
      if (pence < 10) {
        pence = '0' + pence
      }
      return pounds + ':' + pence
    },
    outOfTime(round) {
      return round['time'] >= this.state['timeLimit']
    }
  }
}
</script>

<style>
  .strategies { }
  table { border-collapse: collapse; margin: 0 auto; max-width: 80%; }
  thead td { font-weight: bold; }
  td { border: 1px solid; vertical-align: top; }
  .missed { margin-top: 12px; color: red; font-weight: bold; }

  .coin-parent { display: inline-block; height: 20px; width: 20px; }
  .coin { opacity: 0.3; height: 20px; width: 20px; background-size: 20px 20px; background-repeat: no-repeat; background-position: center center; }
  .played, .customer { opacity: 1.0; }
  .one-p { background-image: url("../assets/img/1p.png"); }
  .two-p { background-image: url("../assets/img/2p.png"); }
  .five-p { background-image: url("../assets/img/5p.png"); }
  .ten-p { background-image: url("../assets/img/10p.png"); }
  .twenty-p { background-image: url("../assets/img/20p.png"); }
  .fifty-p { background-image: url("../assets/img/50p.png"); }
  .one-pound { background-image: url("../assets/img/1pound.png"); }
  .two-pound { background-image: url("../assets/img/2pound.png"); }
</style>
