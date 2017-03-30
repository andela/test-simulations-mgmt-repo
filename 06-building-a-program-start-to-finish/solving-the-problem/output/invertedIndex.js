/**
 * InvertedIndex class
 * @class
 */
class InvertedIndex {
  /**
   * class constructor
   * @constructor
   */
  constructor() {
    this.files = [];
    this.showAllFiles = false;
    this.indexed = {};
    this.showAllFilesSearch = false;
    this.searchAllResult = {};
  }

  /**
   * Validates file content
   * @function
   * @param {Array} fileContent content of uploaded file
   * @return {Array} valid fileContent or false if invalid file
   */
  static validateFile(fileContent) {
    if (fileContent.constructor !== Array || fileContent.length < 1) {
      return false;
    }
    let invalid = false;
    fileContent.forEach((book) => {
      if (book.title === undefined || book.text === undefined) {
        invalid = true;
        return;
      }
      if (book.text.length < 1) invalid = true;
    });
    if (invalid) return false;
    return fileContent;
  }

  /**
   * Remove invalid characters
   * @function
   * @param {String} text text from the book
   * @return {Array} An array of unique words in the text
   */
  static tokenize(text) {
    return text.replace(/[^\w\s-]/g, '')
      .toLowerCase().split(/\s+/)
      .filter((word, index, collection) => collection.indexOf(word) === index);
  }

  /**
   * Creates an index object from the file content and stores it
   * @function
   * @param {Array} fileContent content of uploaded file
   * @param {String} filename name of uploaded file
   * @return {boolean} true if file index was successfully created, else false
   */
  createIndex(fileContent, filename) {
    if (this.files.indexOf(filename) !== -1) return false;
    const result = { bookTitles: [], words: {}, allWords: [], filename };
    const fileLength = fileContent.length;
    fileContent.forEach((book, bookNumber) => {
      result.bookTitles.push(book.title);
      const words = InvertedIndex.tokenize(book.text);
      words.forEach((word) => {
        if (result.words[word] === undefined) {
          result.allWords.push(word);
          result.words[word] = new Array(fileLength).fill(false);
        }
        result.words[word][bookNumber] = true;
      });
    });
    this.showAllFiles = false;
    this.files.push(filename);
    this.indexed = result;
    this[filename] = result;
    return true;
  }

  /**
   * Returns stored index for a file given a filename
   * @function
   * @param {Object} filename name of the file
   * @return {Array} indexed object or false if file was not found
   */
  getIndex(filename) {
    if (this[filename] === undefined) return false;
    this.showAllFiles = false;
    this.indexed = this[filename];
    return this.indexed;
  }

  /**
   * Search index
   * @function
   * @param {String} searchKey string containing word(s) to be searched for
   * @param {Object} filename name of indexed file where
   * the search will be performed
   * @return {Object} search result or false if nothing was found
   */
  searchIndex(searchKey, filename) {
    if (searchKey === undefined || searchKey.length < 1
      || this[filename] === undefined) {
      return false;
    }
    const searchTerms = InvertedIndex.tokenize(searchKey);
    const result = { bookTitles: [], words: {}, allWords: [] };
    searchTerms.forEach((word) => {
      if (this[filename].words[word] !== undefined) {
        result.allWords.push(word);
        result.words[word] = this[filename].words[word];
      }
    });
    if (result.allWords.length < 1) return false;
    result.bookTitles = this[filename].bookTitles;
    return result;
  }

  /**
   * Search All
   * @function
   * @param {String} searchKey string containing word(s) to be searched for
   * @return {Object} search result or false if nothing was found
   */
  searchAll(searchKey) {
    const searchAllResult = { files: [] };
    this.files.forEach((filename) => {
      const result = this.searchIndex(searchKey, filename);
      if (result) {
        searchAllResult.files.push(filename);
        searchAllResult[filename] = result;
      }
    });
    if (searchAllResult.files.length < 1) return false;
    return searchAllResult;
  }

  /**
   * Delete file from the index
   * @function
   * @param {String} filename name of file to be deleted
   * @return {boolean} true if file was successfully deleted, else false
   */
  deleteFile(filename) {
    if (this[filename] === undefined) return false;
    this.showAllFilesSearch = false;
    this.showAllFiles = true;
    this[filename] = undefined;
    this.files.splice(this.files.indexOf(filename), 1);
    return true;
  }
}
