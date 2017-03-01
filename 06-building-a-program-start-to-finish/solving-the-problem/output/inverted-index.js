const helpers = require('./helpers');

/**
 * @class InvertedIndex
 */
class InvertedIndex {

  /**
   * Creates an instance of InvertedIndex.
   * @memberOf InvertedIndex
   */
  constructor() {
    this.indices = {};
  }
  
  /**
   * Checks if file is a valid json file
   * @param   {Array} data - file in which to determine validity
   * @returns {Boolean}
   */
  isValid(data) {
    if (!data || !Array.isArray(data)|| data.length < 1) {
      return false;  
    }
    const valid = data.map((book) => {
      if (!book.title || !book.text) {
        return false;
      } else if (typeof book.title === 'string' && typeof book.text === 'string'){
        return true;
      }
    });
    return (valid.indexOf(false) === -1);
  }
  
  /**
   * Generates index for a valid json file
   * @param {String} fileName - A string for name of file to be indexed
   * @param   {Array} data - an Array of objects to be indexed
   * @returns {Object} in key value pair where each word is key 
   * and value is an  array of titles
   */
  generateIndex(fileName, data) {
    if (!this.isValid(data)) {
      return null;
    }
    const index = {};
    data.map((book) => {
      const text = helpers.stripStr(book.text).split(' ');
      text.forEach((word) => {
        if (index[word]) {
          const wordArray = index[word];
          if (wordArray.indexOf(book.title) === -1) {
            wordArray.push(book.title);
            index[word] = wordArray;
          }
        } else if(word !== '') {
          index[word] = [book.title];
        }
      });
      return null;
    });

    this.indices[fileName] = helpers.sort(index);
    // sort is found in helper.js
    return helpers.sort(index);
  }
  
  /**
   * Searches for a keyword or phrase within a generated index
   * @param   {String} query - word or phrase to search for
   * @param   {Object} filename - generated index to search in
   * @returns {Object} result - in key value pair where each word in the query is key and value is an  array of titles
   */
  search(query, filename) {
    const words = Object.keys(this.indices[filename]);
    const queryArray = helpers.stripStr(query).split(' ');
    const result = {};
    queryArray.forEach((word) => {
      if (words.indexOf(word) !== -1 && word !== ' ') {
        result[word] = this.indices[filename][word];
      }
    });
    return result;
  }
  
  
  /**
   * Searches for a keyword or phrase within multiple generated indices
   * @param   {String} query   [[word or phrase to search for]]
   * @param   {Array} dataset [[Array containing all generated index in which to search in]]
   * @returns {Object} searchResults [[Object containing mapping of file name to the search result in each file]]
   */
  searchAll(query) {
    const searchResults = {};
    Object.keys(this.indices).forEach((fileName) => {
      searchResults[fileName] = this.search(query, fileName);
    });
    return searchResults;
  }
}

module.exports = InvertedIndex;