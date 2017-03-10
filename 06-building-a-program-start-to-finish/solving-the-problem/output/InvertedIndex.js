/* eslint-disable no-unsed-vars */
/* eslint-disable no-undef */

/**
 *Class for creating an inverted index.
 * @class InvertedIndex
 */
class InvertedIndex {
/**
* Creates an instance of InvertedIndex.
* @memberOf InvertedIndex
*/
  constructor() {
    this.mainIndex = {};
    this.bookNames = [];
    this.fileIndex = {};
  }

/**
 * Gets a book and returns it's text property
 * @param {Object} book - a book object with title and text property
 * @returns {String} or {boolean} - returns boolean
 *  or string depending on if data is valid
 * @memberOf InvertedIndex
 */
  getBookText(book) {
    const status = InvertedIndexUtility.validateInput([book]);
    if (status) {
      this.bookNames.push(book.title);
      return book.text;
    }
    return status;
  }

/**
 * Builds an index for a Book Objects
 * @param {Array} books - An Array of book objects
 * @param {String} fileName - name of the input json file
 * @returns {Boolean} Build status as a feedback message
 * @memberOf InvertedIndex
 */
  buildIndex(books, fileName) {
    try {
      let nonUniqueWords = '';
      let words = '';
      books.forEach((book) => {
        nonUniqueWords = InvertedIndexUtility
          .generateToken(this.getBookText(book));
        words = InvertedIndexUtility.createUniqueWords(nonUniqueWords);
        words.forEach((word) => {
          if (this.mainIndex[word]) {
            this.mainIndex[word].push(book.title);
          } else {
            this.mainIndex[word] = [book.title];
          }
        });
        const mainIndex = this.mainIndex;
        this.addIndexToFileIndex(fileName, mainIndex);
      });
      return true;
    } catch (e) {
      return false;
    }
  }
/**
 * Takes a file name and an indexed book and stores it in the fileIndex
 * @param {String} fileName - name of the input json file
 * @param {Object} indexedFile - index created for json file
 * @returns {none} ...
 * @memberOf InvertedIndex
 */
  addIndexToFileIndex(fileName, indexedFile) {
    if (this.fileIndex[fileName]) {
      this.fileIndex[fileName] = indexedFile;
    } else {
      this.fileIndex[fileName] = indexedFile;
    }
  }

  /**
   * Takes in a search query or word(s) and searches
   * all indexed files to return books for which each word is found in
   * @param {String} searchedWords - word(s) to search for
   * @returns {Array} searchResult - books for which word is found in
   * @memberOf InvertedIndex
   */
  searchAll(searchedWords) {
    let searchResult = [];
    const wordsToSearch = InvertedIndexUtility
    .createUniqueWords(InvertedIndexUtility
      .generateToken(searchedWords));
    const indexedWords = Object.keys(this.mainIndex);
    wordsToSearch.forEach((searchedWord) => {
      indexedWords.forEach((indexedWord) => {
        if (searchedWord === indexedWord) {
          searchResult = this.mainIndex[indexedWord];
        }
      });
    });
    return searchResult;
  }
  /**
   * Takes in a search query or word(s) and searches the file
   * for which that word is found to return books indexed for that word
   * @param {String} searchedWords - word(s) to search for
   * @param {String} fileName - name of the input json file
   * @returns {Array} searchResult - books for which word is found in
   * @memberOf InvertedIndex
   */
  searchByFile(searchedWords, fileName) {
    let searchResult = [];
    const wordsToSearch = InvertedIndexUtility
    .createUniqueWords(InvertedIndexUtility
     .generateToken(searchedWords));
    wordsToSearch.forEach((word) => {
      const indexedWords = Object.keys(this.fileIndex[fileName]);
      if (indexedWords.indexOf(word) !== -1) {
        searchResult = this.fileIndex[fileName][word];
      }
    });
    return searchResult;
  }
}
