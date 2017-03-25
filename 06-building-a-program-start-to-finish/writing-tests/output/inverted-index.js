/* eslint-disable no-undef */

/**
 * inverted index class
 * @class
**/
class InvertedIndex { //  eslint-disable-line
  /**
  * class constructor
  * @constructor
  **/
  constructor() {
    this.fileIndices = {};
    this.searchIndices = {};
  }
  /**
   * Set Index - Sets the indices of all indexed files
   * @param {String} filename - Name of the indexed file
   * @param {Object} indices - Indices of the file
   * @return {object} Indexed file name and it's indices'
  **/
  setIndex(filename, indices) {
    this.fileIndices[filename] = indices;
  }
  /**
   * Validate File
   * It checks if a json file is a json array of json objects
   * @param {Object} file is an array of json objects
   * @return {Boolean} True if a json file is valid and False otherwise
  **/
  validateFile(file) { // eslint-disable-line
    if (typeof file !== 'object' || file.length === 0 || !Array.isArray(file)) {
      return false;
    }
    for (let i = 0; i < file.length; i += 1) {
      const item = file[i];
      if (!(item.hasOwnProperty('title') && item.hasOwnProperty('text'))) { // eslint-disable-line
        return false;
      }
    }
    return true;
  }
  /**
   * Tokenize
   * It splits sentence into an array of refined words
   * @param {String} text - string of texts
   * @return {Array} An array of refined splitted texts
  **/
  tokenize(text) {  //eslint-disable-line
    const remove = /[^'^\w\s]/g;
    return text.replace(remove, ' ').toLowerCase().split(' ')
    .sort()
    .filter(item => Boolean(item));
  }
  createIndex(fileName, fileContent) {  //eslint-disable-line
    const indices = {};
    if (this.validateFile(fileContent)) {
      fileContent.forEach((doc, docIndex) => {
        const newString = `${doc.title} ${doc.text}`;
        const tokenArray = this.tokenize(newString);
        tokenArray.forEach((token) => {
          if (token in indices) {
            if (indices[token].indexOf(docIndex) === -1) {
              indices[token].push(docIndex);
            }
          } else {
            indices[token] = [docIndex];
          }
        });
      });
      this.setIndex(fileName, indices);
      return 'Index created';
    }
    return 'Index not created';
  }
  /**
   * Get Index
   * It gets the index of a specified filename
   * @param {String} filename - Filename of the index to get
   * @return {Object} An object of each word and their indices in a sorted way
  **/
  getIndex(filename) {
    const newObj = {};
    const tokens = Object.keys(this.fileIndices[filename]).sort();
    tokens.forEach((token) => {
      newObj[token] = this.fileIndices[filename][token];
    });
    return newObj;
  }
   /**
   * Search Index
   * It searches through file(s)
   * @param {String} searchTerm - words to search
   * @param {String} filename - Filename of the index to get
   * @return {Object} Displays table of search result
  **/
  searchIndex(searchTerm, filename) {
    let searchResult = {};
    this.searchIndices = {};
    searchTerm = this.tokenize(searchTerm);
    let index;

    if (filename !== 'All files') {
      // Search single file with filename
      index = this.fileIndices[filename];
      searchTerm.forEach((term) => {
        if (index[term]) {
          searchResult[term] = index[term];
        }
      });
      this.searchIndices[filename] = searchResult;
      return this.searchIndices;
    }
    // Search all files
    Object.keys(this.fileIndices).forEach((file) => {
      searchResult = {};
      index = this.fileIndices[file];
      searchTerm.forEach((term) => {
        if (index[term]) {
          searchResult[term] = index[term];
        }
      });
      this.searchIndices[file] = searchResult;
    });
    return this.searchIndices;
  }
}
