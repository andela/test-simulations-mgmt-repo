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
    this.fetchTitle = helpers.fetchTitle;
    this.isFound = helpers.isFound;
  }

  /**
   * Generates index for a valid json file
   * @param {String} fileName - A string for name of file to be indexed
   * @param   {Array} fileContents - an Array of objects to be indexed
   * @returns {Object} in key value pair where each word is key
   * and value is an  array of titles
   */
  generateIndex(fileName, fileContents) {
    if (!helpers.isValid(fileContents)) {
      return null;
    }
    const index = {};
    fileContents.forEach((book) => {
      const text = helpers.stripStr(book.text).split(' ');
      text.forEach((word) => {
        if (index[word]) {
          const wordList = index[word];
          if (wordList.indexOf(book.title) === -1) {
            wordList.push(book.title);
            index[word] = wordList;
          }
        } else if (word !== '') {
          index[word] = [book.title];
        }
      });
    });

    this.indices[fileName] = helpers.sort(index);
    return helpers.sort(index);
  }

  /**
   * Searches for a keyword or phrase within a generated index
   * @param   {String} query - word or phrase to search for
   * @param   {Object} fileName - generated index to search in
   * @returns {Object} result - in key value pair where each word
   * in the query is key and value is an  array of titles
   */
  search(query, fileName) {
    const words = Object.keys(this.indices[fileName]);
    const queryList = helpers.stripStr(query).split(' ');
    const result = {};
    queryList.forEach((word) => {
      if (words.indexOf(word) !== -1 && word !== ' ') {
        result[word] = this.indices[fileName][word];
      } else if (words.indexOf(word) === -1 && word !== '') {
        result[word] = [null];
      }
    });
    return helpers.allIsEmpty(result) ? null : result;
  }

  /**
   * Searches for a keyword or phrase within multiple generated
   * indices
   * @param   {String} query - word or phrase to search for
   * @param   {Array} dataset - Array containing all generated index
   * in which to search in
   * @returns {Object} searchResults - Object containing mapping of
   * file name to the search
   * result in each file
   */
  searchAll(query) {
    const searchResults = {};
    Object.keys(this.indices).forEach((fileName) => {
      searchResults[fileName] = this.search(query, fileName);
    });
    return searchResults;
  }
}

window.InvertedIndex = InvertedIndex;

module.exports = InvertedIndex;
