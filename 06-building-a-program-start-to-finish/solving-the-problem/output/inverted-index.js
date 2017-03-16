/**
 * An inverted-index class
 * @class
 */
class InvertedIndex {
  /**
  * class constructor
  * @constructor
  */
  constructor() {
    this.allIndex = {};
    this.allFiles = {};
    this.allLength = {};
    this.allFilesTitle = [];
    this.validatedFile = {};
  }

  /**
   * Validate Method
   * @param {Object} validateFile an object to be validated
   * @returns {Object} file that has been validated
   */
  validateFile(validateFile) {
    if (validateFile.title !== undefined && validateFile.text !== undefined) {
      return true;
    }
    return false;
  }

  /**
   * sanitizing objects
   * @param {Object} BookObject receives json object
   * @return {Array} returns an array of names
   */
  sanitizingObj(BookObject) {
    Object.keys(BookObject).forEach((titles) => {
      this.allFilesTitle.push(BookObject[titles].title);
    });
  }

  /**
   * Gets Index for a particular book
   * @param {string} bookName name of the individual book
   * @returns {Object} object containing all Indices
   */
  getIndex(bookName) {
    if (bookName !== undefined) {
      return this.allFiles[bookName];
    }
    return undefined;
  }

  /**
   * Gets Indexes
   * @param {Object} bookObject receives json object
   * @param {string} bookName of the books
   * @return {object} returns an object of Indexes
   */
  createIndex(bookObject, bookName) {
    this.sanitizingObj(bookObject);
    this.allLength[bookName] = bookObject.length;
    bookObject.forEach((document, position) => {
      const words = document.text
      .toLowerCase()
      .match(/\w+/g);
      words.forEach((word) => {
        if (this.allIndex[word]) {
          if (!this.allIndex[word][position]) {
            this.allIndex[word][position] = true;
          }
        } else {
          const wordIndex = {};
          wordIndex[position] = true;
          this.allIndex[word] = wordIndex;
        }
      });
    });
    this.allFiles[bookName] = this.allIndex;
    this.allIndex = {};
    return this.allFiles[bookName];
  }

  /**
   * Search function
   * @param {string} queryString word to Search
   * @param {string} fileName book name to search
   * @return {Object} searchResult
   */
  searchFiles(queryString, fileName) {
    const searchResult = {};
    let searchResultKey = {};
    if (fileName === 'All') {
      Object.keys(this.allFiles).forEach((keys) => {
        searchResultKey = {};
        Object.keys(queryString).forEach((query) => {
          searchResultKey[queryString[query]] = { 0: false };
          Object.keys(this.allFiles[keys]).forEach((key) => {
            if (queryString[query] === key) {
              searchResultKey[queryString[query]] = this.allFiles[keys][key];
            }
          });
        });
        searchResult[keys] = searchResultKey;
      });
      return searchResult;
    } else {
      Object.keys(queryString).forEach((query) => {
        searchResultKey[queryString[query]] = { 0: false };
        Object.keys(this.allFiles[fileName]).forEach((key) => {
          if (queryString[query] === key) {
            searchResultKey[queryString[query]] = this.allFiles[fileName][key];
          }
        });
      });
      searchResult[fileName] = searchResultKey;
      return searchResult;
    }
  }
}
