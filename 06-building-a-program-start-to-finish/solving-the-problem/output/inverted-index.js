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
   * Validate Method
   * @param {Object} fileContent an object to be validated
   * @returns {Boolean} returns true and false
   */
  isValid(fileContent) {
    this.title = fileContent.title;
    this.text = fileContent.text;
    return (this.title !== undefined && this.text !== undefined);
  }

  /**
   * Gets book title
   * @param {Object} book receives json object
   * @return {Array} returns an array of names
   */
  getTitle(book) {
    Object.keys(book).forEach((titles) => {
      this.allFilesTitle.push(book[titles].title);
    });
  }

  /**
   * Gets Index for a particular book
   * @param {string} bookName name of the individual book
   * @returns {Object} object containing all Indices
   */
  getIndex(bookName) {
    return (bookName !== undefined) ? this.allFiles[bookName] : undefined;
  }

  /**
   * Gets Indexes
   * @param {Object} bookObject receives json object
   * @param {string} bookName of the books
   * @return {object} returns an object of Indexes
   */
  createIndex(bookObject, bookName) {
    this.getTitle(bookObject);
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
   * @param {string} searchTerm words to Search
   * @param {string} fileName book name to search
   * @return {Object} searchResult
   */
  searchFiles(searchTerm, fileName) {
    const searchResult = {};
    let searchResultKey = {};
    if (fileName === 'All') {
      Object.keys(this.allFiles).forEach((keys) => {
        searchResultKey = {};
        Object.keys(searchTerm).forEach((word) => {
          searchResultKey[searchTerm[word]] = { 0: false };
          Object.keys(this.allFiles[keys]).forEach((key) => {
            if (searchTerm[word] === key) {
              searchResultKey[searchTerm[word]] = this.allFiles[keys][key];
            }
          });
        });
        searchResult[keys] = searchResultKey;
      });
    } else {
      Object.keys(searchTerm).forEach((word) => {
        searchResultKey[searchTerm[word]] = { 0: false };
        Object.keys(this.allFiles[fileName]).forEach((key) => {
          if (searchTerm[word] === key) {
            searchResultKey[searchTerm[word]] = this.allFiles[fileName][key];
          }
        });
      });
      searchResult[fileName] = searchResultKey;
    }
    return searchResult;
  }
}
