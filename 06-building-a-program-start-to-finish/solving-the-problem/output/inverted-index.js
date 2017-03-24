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
    this.filenames = [];
    this.titles = [];
    this.indices = [];
  }

  /**
   * Creates an index for an array of books.
   * @param {Array} books - The books to be indexed
   * @param {String} filename - The name of the file the books come from
   * @return {void}
   */
  createIndex(books, filename) {
    this.filenames.push(filename);
    const titles = [];
    const index = {};
    for (let i = 0; i < books.length; i += 1) {
      titles.push(books[i].title);
      const bookTokens =
        InvertedIndex.tokenize(`${books[i].title} ${books[i].text}`);
      for (let j = 0; j < bookTokens.length; j += 1) {
        if (bookTokens[j] in index) {
          index[bookTokens[j]].push(books[i].title);
        } else {
          index[bookTokens[j]] = [books[i].title];
        }
      }
    }
    this.titles.push(titles);
    this.indices.push(index);
  }

  /**
   * Gets the index for a particular file.
   * @param {String} filename - Name of the file to be retrieved
   * @returns {Object} - Index for a file
   */
  getIndex(filename) {
    const fileIndex = this.filenames.indexOf(filename);
    return this.indices[fileIndex];
  }

  /**
   * Gets the titles for a particular file.
   * @param {String} filename - Name of the file to be retrieved
   * @returns {Array} - Titles in a file
   */
  getTitles(filename) {
    const fileIndex = this.filenames.indexOf(filename);
    return this.titles[fileIndex];
  }

  /**
   * Searches the inverted index for (a) given keyword(s).
   * @param {String} keywords - String of keyword(s) to search for
   * @param {Array} filenames - Names of files to be searched
   * @returns {Object} resultIndex - Object literal containing matching books
   */
  searchIndex(keywords, filenames) {
    const keyTokens = InvertedIndex.tokenize(keywords).sort();
    const resultIndex = {
      results: {},
      titles: []
    };
    keyTokens.forEach((token) => {
      filenames.forEach((filename) => {
        const fileIndex = this.filenames.indexOf(filename);
        if (this.indices[fileIndex][token]) {
          resultIndex.titles = [...new Set([...resultIndex.titles,
            ...this.indices[fileIndex][token]])];
          if (resultIndex.results[token]) {
            resultIndex.results[token] = resultIndex.results[token]
              .concat(this.indices[fileIndex][token]);
          } else {
            resultIndex.results[token] = this.indices[fileIndex][token];
          }
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
    if (Array.isArray(fileData) && fileData.length > 0) {
      for (let i = 0; i < fileData.length; i += 1) {
        if (typeof fileData[i] !== 'object' || !fileData[i].title ||
        !fileData[i].text) {
          return false;
        }
      }

      return true;
    }
    return false;
  }

  /**
   * Parses a passed string into unique tokens (individual words).
   * @param {String} str - Sttring to be tokenized
   * @returns {Array} - An array of unique tokens
   * @static
   */
  static tokenize(str) {
    return [...new Set(str.toLowerCase()
      .replace(/[^\s\w]|_/g, '')
      .split(/\s+/))];
  }
}

module.exports = InvertedIndex;
