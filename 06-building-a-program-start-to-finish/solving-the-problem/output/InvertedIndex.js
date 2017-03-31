const fileAPI = require('file-api');

const FileReader = fileAPI.FileReader;
/**
 * An implementation of the inverted index data structure.
 * @author Princess-Jewel Essien <princess-jewel.essien@andela.com>
 */
class InvertedIndex {
  /**
   * Creates an instance of InvertedIndex.
   * @constructor
   */
  constructor() {
    this.fileNames = [];
    this.titles = [];
    this.indices = [];
  }

  /**
   * Creates an index for an array of books.
   * @param {Array} books - The books to be indexed
   * @param {String} fileName - The name of the file the books come from
   * @return {void}
   */
  createIndex(books, fileName) {
    this.fileNames.push(fileName);
    const titles = [];
    const index = {};
    books.forEach((book) => {
      titles.push(book.title);
      const tokens = InvertedIndex.tokenize(`${book.title} ${book.text}`);
      tokens.forEach((token) => {
        if (token in index) {
          index[token].push(book.title);
        } else {
          index[token] = [book.title];
        }
      });
    });
    this.titles.push(titles);
    this.indices.push(index);
  }

  /**
   * Removes the index for the books in a specified file.
   * @param {String} fileName - The name of the file to be removed
   * @return {void}
   */
  removeIndex(fileName) {
    const fileIndex = this.fileNames.indexOf(fileName);
    if (fileIndex > -1) {
      this.fileNames.splice(fileIndex, 1);
      this.titles.splice(fileIndex, 1);
      this.indices.splice(fileIndex, 1);
    }
  }

  /**
   * Gets the index for a particular file.
   * @param {String} fileName - Name of the file to be retrieved
   * @returns {Object} - Index for a file
   */
  getIndex(fileName) {
    const fileIndex = this.fileNames.indexOf(fileName);
    if (fileIndex > -1) {
      return this.indices[fileIndex];
    }
    return null;
  }

  /**
   * Gets the titles for a particular file.
   * @param {String} fileName - Name of the file to be retrieved
   * @returns {Array} - Titles in a file
   */
  getTitles(fileName) {
    const fileIndex = this.fileNames.indexOf(fileName);
    return this.titles[fileIndex];
  }

  /**
   * Searches the inverted index for (a) given keyword(s).
   * @param {String} keywords - String of keyword(s) to search for
   * @param {Array} fileNames - Names of files to be searched
   * @returns {Object} resultIndex - Object literal containing matching books
   */
  searchIndex(keywords, fileNames) {
    const keyTokens = InvertedIndex.tokenize(keywords).sort();
    const resultIndex = {
      results: {},
      titles: []
    };
    fileNames.forEach((fileName) => {
      resultIndex.titles = resultIndex.titles.concat(this.getTitles(fileName));
    });
    keyTokens.forEach((token) => {
      resultIndex.results[token] = [];
      fileNames.forEach((fileName) => {
        if (this.getIndex(fileName)[token]) {
          resultIndex.results[token] = resultIndex.results[token]
            .concat(this.getIndex(fileName)[token]);
        }
      });
    });
    return resultIndex;
  }

  /**
   * Reads the data from an uploaded file.
   * @param {File} file - The file to be read
   * @param {Function} callback - The callback function on file read
   * @returns {void}
   */
  static readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = callback;
    reader.readAsText(file);
  }

  /**
   * Checks passed data for conformity to proper structure: an array of object
   * literals
   * each having a "title" and a "text" property.
   * @param {Array} fileData - Data to be validated
   * @returns {boolean} - Valid (true) or invalid (false)
   * @static
   */
  static validateFile(fileData) {
    let isValid = true;
    if (Array.isArray(fileData) && fileData.length > 0) {
      fileData.forEach((data) => {
        if (typeof data !== 'object' || !data.title || !data.text) {
          isValid = false;
        }
      });
    } else {
      isValid = false;
    }
    return isValid;
  }

  /**
   * Parses a passed string into unique tokens (individual words).
   * @param {String} text - String to be tokenized
   * @returns {Array} - An array of unique tokens
   * @static
   */
  static tokenize(text) {
    return [...new Set(text.toLowerCase()
      .replace(/[^\s\w]|_/g, '')
      .split(/\s+/))];
  }
}

module.exports = InvertedIndex;
