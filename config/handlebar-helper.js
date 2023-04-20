// helper
const handlebars = require('handlebars')

const handlebarHelper = {

  isSame: (string1, string2, options) => {
    if (string1 === string2) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
}

module.exports = handlebarHelper

