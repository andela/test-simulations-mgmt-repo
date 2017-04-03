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
    this.indexed = {};
  }

  /**
   * Get the index for a particular file
   * @function
   * @param {String} fileName
   * @return {Object} index object
   */
  getIndex(fileName) {
    return this.indexed[fileName];
  }

  /**
   * Read files using FileReader
   * @function
   * @param {String} file
   * @return {Promise} validateFile response
   */
  static readFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const fileToValidate = JSON.parse(reader.result);
          const response = InvertedIndex.validateFile(fileToValidate);
          resolve(response);
        };
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Validate File
   * @function
   * @param {string} fileToValidate content of the file uploaded
   * @return {Object} result.success should return true or false
   */
  static validateFile(fileToValidate) {
    const fileLength = fileToValidate.length;
    let result = {};
    for (let key = 0; key < fileLength; key += 1) {
      if (typeof fileToValidate !== 'object'
          || Object.keys(fileToValidate[key]).length !== 2
          || fileToValidate[key].title === undefined
          || fileToValidate[key].text === undefined
          || typeof fileToValidate[key].title !== 'string'
          || typeof fileToValidate[key].text !== 'string') {
        result = {
          success: false,
          message: 'has an invalid JSON format.'
        };
      } else {
        result = {
          success: true,
          message: 'File is valid',
          fileToValidate
        };
      }
    }
    return result;
  }

  /**
   * Get individual words from a string of text.
   * @function
   * @param {String} words text to be tokenized.
   * @return {Array} array of string tokens
   */
  static tokenize(words) {
    const pattern = /[ .:;?!~,`'&|()<>{}[\]\r\n/\\]+/;
    return words.toLowerCase().split(pattern);
  }

  /**
   * Create index
   * @function
   * @param {string} fileName
   * @param {Array} books
   * @return {Object} index object
   */
  createIndex(fileName, books) {
    const indices = {};
    books.forEach((book, index) => {
      let words = '';
      words = (`${book.title} ${book.text}`);
      words = InvertedIndex.tokenize(words);
      words.forEach((word) => {
        if (indices[word]) {
          if (indices[word].indexOf(index) === -1) {
            indices[word].push(index);
          }
        } else {
          indices[word] = [index];
        }
      });
    });
    this.indexed[fileName] = {
      eachWord: indices,
      numOfDocs: books.length
    };
  }

  /**
   * Search Index.
   * @function
   * @param {String} phrase search string
   * @returns {Object} search result object.
   */
  searchIndex(phrase) {
    const result = {};
    const files = this.indexed;
    Object.keys(files).forEach((filename) => {
      const storedIndex = this.getIndex(filename);
      const searchWords = InvertedIndex.tokenize(phrase);
      const search = {
        eachWord: {},
        numOfDocs: storedIndex.numOfDocs
      };
      searchWords.forEach((word) => {
        if (storedIndex.eachWord[word]) {
          search.eachWord[word] = storedIndex.eachWord[word];
        } else search.eachWord[word] = [];
      });
      result[filename] = search;
    });
    return result;
  }
}
