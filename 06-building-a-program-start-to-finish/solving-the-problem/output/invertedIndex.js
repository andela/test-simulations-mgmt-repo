
/**
 * InvertedIndex class with constructor
 * @class
 */
class InvertedIndex {

  /** creates index and update the indexed files
   * @param {Array} word - object to br returned
   * @param {Array} filteredContents - an array of all contents in file
   * @param {object} wordMap - an array of all contents in file
   * @return  {object}  wordMap - a map of each token to
   *  there respective indexes
   */
  checkForIndex(word, filteredContents, wordMap) {
    filteredContents.forEach((book) => {
      if (book.includes(word)) {
        if (!wordMap[word]) {
          wordMap[word] = [true];
        } else {
          wordMap[word].push(true);
        }
      } else if (!wordMap[word]) {
        wordMap[word] = [false];
      } else {
        wordMap[word].push(false);
      }
    });
    return wordMap;
  }

/** creates index and update the indexed files
  * @param {Array} tokens - object to br returned
  * @param {Array} filteredContents - an array of all contents in file
  * @param {function} checkForIndex - an array of all contents in file
  * @return  {object}  - this.wordMap;
  */
  createIndex(tokens, filteredContents) {
    this.wordMap = {};
    tokens.forEach((word) => {
      this.checkForIndex(word, filteredContents, this.wordMap);
    });
    return this.wordMap;
  }


/** search for words in indexFiles and return the result
  * @param {Array} tokens - object to br returned
  * @param {object} indexx - a collection of indexed files
  * @return  {object}  - this.searchMap;
  */
  searchIndex(tokens, indexx) {
    this.searchMap = {};
    tokens.forEach((word) => {
      if (word in indexx) {
        this.searchMap[word] = indexx[word];
      } else {
        this.searchMap[word] = Array(3).fill(false);
      }
    });
    return this.searchMap;
  }
}
