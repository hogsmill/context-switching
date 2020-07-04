
var Params = {

  isParam: function(param) {
    var search = location.search.replace('?', '').split('&')
    var found = false
    for (var i = 0; i < search.length; i++) {
      if (search[i] == param) {
        found = true
      }
    }
    return found
  },

  getParam: function(param) {
    var search = location.search.replace('?', '').split('&')
    var found = ''
    for (var i = 0; i < search.length; i++) {
      var p = search[i].match(/(.*)=(.*)/)
      if (p && p[1] == param) {
        found = p[2]
      }
      return found
    }

  }
}

export default Params
