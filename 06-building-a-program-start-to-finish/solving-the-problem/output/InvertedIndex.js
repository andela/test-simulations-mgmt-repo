/**
 * InvertedIndex Class
 *
 * @class
 */
class InvertedIndex {

  /**
   * Constructor initializes indices to an empty object and keeps track of
   * indexed files
   * @constructor
   */
  constructor() {
    this.indexedFiles = {};
    this.validationResponse = {
      EMPTY_FILE: 'Empty file',
      INVALID_CONTENT: 'Invalid file content',
      INVALID_FILE: 'Invalid file',
      VALID_FILE: 'Valid file'
    };
  }

  /**
   * removes special characters, white spaces, duplicates and returns an array
   * @function
   * @param {string} text document title and text
   * @return {Array} array of tokens
   */
  static tokenize(text) {
    const uniqueWords = [];
    const token = text.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .match(/\w+/g);
    token.forEach((item) => {
      if (!uniqueWords.includes(item)) {
        uniqueWords.push(item);
      }
    });
    return uniqueWords;
  }

  /**
   * create index
   * @function
   * @param {object} fileContents objects in an Array
   * @param {title} fileName file title
   * @return {Object} index object
   */
  createIndex(fileContents, fileName) {
    const fileMap = {};
    fileContents.forEach((jsonObject, index) => {
      const tokens = InvertedIndex.tokenize(`${jsonObject.title} ${jsonObject.text}`);
      tokens.forEach((token) => {
        if (token in fileMap) {
          fileMap[token].push(index);
        } else {
          fileMap[token] = [];
          fileMap[token].push(index);
        }
      });
      this.indexedFiles[fileName] = fileMap;
    });
    return this.indexedFiles;
  }

  /**
   * Get Index
   *
   * getIndex method takes a file name and returns the value of the key in the
   * indexedFiles object that matches the file name
   *
   * @param {string} fileName
   * @returns {Object} Object containing file indices
   */
  getIndex(fileName) {
    return this.indexedFiles[fileName];
  }

  /**
   * searches for query in a particular file or all files
   * @param {string} query to search for
   * @param {string} fileName to file to search
   * @returns {Object} returns an object that contains the index of the files
   */
  searchIndex(query, fileName = 'all') {
    const result = {};
    fileName = (fileName !== 'all') ? [fileName] : Object.keys(this.indexedFiles);
    const searchWords = InvertedIndex.tokenize(query);
    fileName.forEach((file) => {
      result[file] = {};
      const fileIndex = this.indexedFiles[file];
      searchWords.forEach((word) => {
        const indexedWords = Object.keys(fileIndex);
        if (indexedWords.includes(word)) {
          result[file][word] = fileIndex[word];
        } else {
          result[file][word] = [];
        }
      });
    });
    return result;
  }

  /**
   * Validate file
   * @param {object} fileObject to validate
   * @returns {string} validation result
   */
  validateFile(fileObject) {
    let result = this.validationResponse.VALID_FILE;
    try {
      if (typeof fileObject !== 'object' || Object.keys(fileObject).length === 0) {
        result = this.validationResponse.EMPTY_FILE;
      }
      fileObject.forEach((key) => {
        if (typeof key.title !== 'string' || typeof key.text !== 'string') {
          result = this.validationResponse.INVALID_CONTENT;
        }
      });
    } catch (error) {
      result = this.validationResponse.INVALID_FILE;
    }
    return result;
  }

}
