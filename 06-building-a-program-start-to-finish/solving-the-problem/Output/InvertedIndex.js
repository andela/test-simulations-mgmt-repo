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
    this.filenames = [];
  }

  /**
   * Get the index for a particular file
   * @function
   * @param {String} fileName
   * @return {Object} returns the indexed object
   */
  getIndex(fileName) {
    return this.indexed[fileName];
  }

  /**
   * Read files using FileReader
   * @function
   * @param {String} file
   * @return {Promise} from validateFile response
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
   * @return {Object} returns either errorMsg or result.
   */
  static validateFile(fileToValidate) {
    let result = {};
    const errorMsg = {
      success: false,
      message: 'has an invalid JSON format.'
    };
    try {
      result = {
        success: true,
        message: 'File is valid',
        fileToValidate
      };
      fileToValidate.forEach((book) => {
        if (typeof book !== 'object' || Object.keys(book).length !== 2) {
          errorMsg.message = 'has not only one key';
          throw errorMsg;
        }
        if (book.title === undefined || book.text === undefined) {
          errorMsg.message = 'does not have title or text defined';
          throw errorMsg;
        }
        if (book.title === '' || book.text === '') {
          errorMsg.message = 'cannot be empty';
          throw errorMsg;
        }
      });
    } catch (error) {
      if (error.success === false) return errorMsg;
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
   * Creates an index object from the file content and stores it
   * @function
   * @param {String} fileName name of uploaded file
   * @param {Array} books content of uploaded file
   * @return {Object} index of the uploaded file
   */
  createIndex(fileName, books) {
    const indices = {};
    books.forEach((book, index) => {
      let tokens = `${book.title} ${book.text}`;
      tokens = InvertedIndex.tokenize(tokens);
      tokens.forEach((word) => {
        if (indices[word]) {
          if (indices[word].indexOf(index) === -1) {
            indices[word].push(index);
          }
        } else {
          indices[word] = [index];
        }
      });
    });
    this.filenames.push(fileName);
    this.indexed[fileName] = {
      eachWord: indices,
      count: books.length
    };
  }

  /**
   * Searches the index
   * @function
   * @param {String} phrase string containing word(s) to be searched for
   * @param {Object} filename name of an indexed file or All.
   * @return {Object} search result with eachword and number of documents.
   */
  searchIndex(phrase, filename) {
    const result = {};
    const files = (filename === 'All') ? this.filenames : [filename];
    files.forEach((file) => {
      const storedIndex = this.getIndex(file);
      const searchWords = InvertedIndex.tokenize(phrase);
      const search = {
        eachWord: {},
        count: storedIndex.count
      };
      searchWords.forEach((word) => {
        if (storedIndex.eachWord[word]) {
          if (!(search.eachWord[word] in search)) {
            search.eachWord[word] = storedIndex.eachWord[word];
          }
        } else search.eachWord[word] = [];
      });
      result[file] = search;
    });
    return result;
  }
}
