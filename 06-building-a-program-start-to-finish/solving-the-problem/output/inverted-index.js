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
  }

  /**
   * Sanitizer
   * @param {Object} BookObject recieves json object
   * @return {Object} returns an Object of names
   */
  sanitizer(BookObject) {
    Object.keys(BookObject).forEach((titles) => {
      this.allFilesTitle.push(BookObject[titles].title);
    });
  }

  /**
   * Gets Indexes
   * @param {Object} BookObject receives json object
   * @param {string} bookName of the books
   * @return {object} returns an object of Indexes
   */
  createIndex(BookObject, bookName) {
    this.sanitizer(BookObject);
    this.allLength[bookName] = BookObject.length;
    BookObject.forEach((document, position) => {
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
   * Get all Indecies
   * @param {string} bookName name of the individaul book
   * @returns {Object} allIndicies returns all indexed allFiles
   */
  getAllIndecies(bookName) {
    if (bookName !== undefined) {
      return this.allFiles[bookName];
    } return false;
  }

  /**
   * Search function
   * @param {string} queryString word to Search
   * @param {string} filterName book name to search
   * @return {Object} searchResult
   */
  searchFiles(queryString, filterName) {
    const searchResult = {};
    const allSearchQuery = queryString;
    let searchResultKey = {};
    if (filterName === 'All') {
      Object.keys(this.allFiles).forEach((keys) => {
        searchResultKey = {};
        Object.keys(allSearchQuery).forEach((query) => {
          searchResultKey[allSearchQuery[query]] = { 0: false };
          Object.keys(this.allFiles[keys]).forEach((key) => {
            if (allSearchQuery[query] === key) {
              searchResultKey[allSearchQuery[query]] = this.allFiles[keys][key];
            }
          });
        });
        searchResult[keys] = searchResultKey;
      });
      return searchResult;
    }
    Object.keys(allSearchQuery).forEach((query) => {
      searchResultKey[allSearchQuery[query]] = { 0: false };
      Object.keys(this.allFiles[filterName]).forEach((key) => {
        if (allSearchQuery[query] === key) {
          searchResultKey[allSearchQuery[query]] = this.allFiles[filterName][key];
        }
      });
    });
    searchResult[filterName] = searchResultKey;
    return searchResult;
  }
}
