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
   * Gets Indexes
   * @param {jsonObj} BookObject receives json object
   * @param {string} fileName of the books
   * @return {object} returns an object of Indexes
   */
  createIndex(BookObject, fileName) {
    Object.keys(BookObject).forEach((titles) => {
      this.allFilesTitle.push(BookObject[titles].title);
    });
    this.allLength[fileName] = BookObject.length;
    BookObject.forEach((document, position) => {
      const words = document.text.toLowerCase().match(/\w+/g);
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
    this.allFiles[fileName] = this.allIndex;
    this.allIndex = {};
    return this.allFiles[fileName];
  }
  /**
   * Search function
   * @param {string} queryString word to Search
   * @param {fileName} filterName book name to search
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
