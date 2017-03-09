
/**
 * InvertedIndex class with constructor
 * @class
 */
class InvertedIndex {

  constructor() {
    this.indexedFiles = {};
    this.searchResults = {};
  }

  /** creates index and update the indexed files
   * @param {Array} word - object to br returned
   * @param {Array} filteredContents - an array of all contents in file
   * @param {object} wordMap - an array of all contents in file
   * @return  {object}  wordMap - a map of each token to
   *  there respective indexes
   */
  static checkForIndex(word, filteredContents, wordMap) {
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
      InvertedIndex.checkForIndex(word, filteredContents, this.wordMap);
    });
    return this.wordMap;
  }


  /** creates index and update the indexed files
   * @param {object} books - object containing books
   * @param {Sting} file - file name
   * @param {function} alerts - function to alert error
   * @return  {null}  - null
   */
  createFileIndex(books, file) {
    this.selectedBook = books[file].content;
    this.validateContent = helpers.validFileContent(this.selectedBook);
    if (this.validateContent) {
      this.filteredContents = helpers.filterBookContents(this.selectedBook);
      this.tokens = helpers.getToken(this.filteredContents);
      if (!(this.indexedFiles.hasOwnProperty(file))) {
        this.indexedFiles[file] = this.createIndex(this.tokens,
        this.filteredContents, this.checkForIndex);
      }
      return this.indexedFiles;
    }
    return null;
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

  /** updates searches object with search results
   * @param {String} file - name of file to search from
   * @param {Array} tokens - Array of words to search
   * @return  {object}  - word and index map of search words
   */
  updateSearchResult(file, tokens) {
    const search = this.searchIndex(tokens,
    this.indexedFiles[file]);
    this.searchResults[file] = search;
    return this.searchResults;
  }
}

