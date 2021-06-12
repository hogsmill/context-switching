
import { v4 as uuidv4 } from 'uuid'

const LocalStorage = {

  check: function() {
    let check
    const uuid = uuidv4()
    try {
      localStorage.setItem('agile-simulations-test', uuid)
      if (localStorage.getItem('agile-simulations-test') == uuid) {
        check = 'ok'
      }
      localStorage.removeItem('agile-simulations-test')
    }
    catch(e) {
      check = e
    }
    return check
  },

  fix: function() {

    // TODO: this should only be temp
    //
    const items = [
      'gameName',
      'teamName',
      'myName',
      'myRole'
    ]
    for (let i = 0; i < items.length; i++) {
      const key = items[i]
      if (localStorage.getItem(key)) {
        const val = localStorage.getItem(key)
        localStorage.setItem(key + '-ne', val)
        localStorage.removeItem(key)
      }
    }
  }

}

export default LocalStorage
