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
    this.index = {};
    this.object = {};
    this.allFiles = {};
    this.allLength = {};
    this.allFilesTitle = [];
  }
  /**
   * Gets Indexes
   * @param {jsonObj} object receives json object
   * @param {string} fileName of the books
   * @return {object} returns an object of Indexes
   */
  createIndex(object, fileName) {
    Object.keys(object).forEach((titles) => {
      this.allFilesTitle.push(object[titles].title);
    });
    this.allLength[fileName] = object.length;
    object.forEach((document, position) => {
      const words = document.text.toLowerCase().match(/\w+/g);
      words.forEach((word) => {
        if (this.index[word]) {
          if (!this.index[word][position]) {
            this.index[word][position] = true;
          }
        } else {
          const oneIndex = {};
          oneIndex[position] = true;
          this.index[word] = oneIndex;
        }
      });
    });
    this.allFiles[fileName] = this.index;
    this.index = {};
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
