var randomWords = require('random-words');
const FileDbModel = require('../models/FileDbModel')

async function getUniqueRouteName() {
    let exit = false;
    while (!exit) {
      var word = randomWords();
      const query = await FileDbModel.exists({route: word})
      if(query === null) {
        exit = true;
        return word
      }
    }
  }

module.exports = getUniqueRouteName