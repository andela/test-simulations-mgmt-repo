/**
 *
 *
 * @class InvertedIndex
 */
class InvertedIndex {

/**
 * Creates an instance of InvertedIndex.
 *
 * @memberOf InvertedIndex
 */
  constructor() {
    this.index = {};
  }

/**
 * Tokenizes an array of strings.
 *
 * @param {array} words - An array of string to tokenize
 * @returns {array} Array of words without special character,
 * whitespaces or symbols.
 *
 * @memberOf InvertedIndex
 */
  static tokenize(words) {
    words = words.map(word => word.toLowerCase()
      .replace(/[^A-Za-z]/g, ''))
      .filter(String)
      .sort();
    return words.filter((item, index) => words.indexOf(item) === index);
  }

/**
 * Creates File Index
 *
 * @param {string} fileName - Name of uploaded Json file.
 * @param {object} fileContent - Content of uploaded Json file.
 * @returns {object} Calling storeIndex function
 * an Array of values from uploaded file.
 *
 * @memberOf InvertedIndex
 */
  createIndex(fileName, fileContent) {
    const completeIndex = [];
    if (InvertedIndex.validateFile(fileContent)) {
      fileContent.forEach((value) => {
        const title = value.title;
        const text = value.text;
        const mergeWords = `${title} ${text}`;
        return completeIndex.push(InvertedIndex
          .tokenize(mergeWords.split(' ')));
      });
    }
    return this.storeIndex(fileName, completeIndex);
  }

/**
 * Stores the File Index
 *
 * @param {string} fileName - Name of uploaded Json file
 * @param {array} completeIndex - An Array containing
 * content of uploaded Json file
 * @returns {object} The stored index of the file
 *
 * @memberOf InvertedIndex
 */
  storeIndex(fileName, completeIndex) {
    const wordIndex = {};

    completeIndex.forEach((index) => {
      index.forEach((word) => {
        const indexToInt = completeIndex.indexOf(index);
        if (wordIndex[word]) {
          if (wordIndex[word].indexOf(indexToInt) === -1) {
            wordIndex[word].push(indexToInt);
          }
        } else {
          wordIndex[word] = [indexToInt];
        }
      });
    });
    this.index[fileName] = wordIndex;
    return this.index[fileName];
  }

/**
 * Get file Index
 *
 * @param {String} fileName - name of uploaded Json file
 * @returns {object} stored index of the uploaded Json file
 *
 * @memberOf InvertedIndex
 */
  getIndex(fileName) {
    return this.index[fileName];
  }

/**
 * Searches through one or multiple files for a word
 *
 * @param {String} fileName
 * @param {String} term
 * @returns {Array} Returns search result
 *
 * @memberOf InvertedIndex
 */
  searchIndex(fileName, term) {
    const searchResult = [];
    const search = {};
    term = term.toLowerCase()
                .replace(/[^A-Za-z]/g, ' ')
                .match(/\w+/g);

    search[fileName] = {};

    if (fileName === 'all') {
      Object.keys(this.index).forEach((file) => {
        search[file] = {};
        term.forEach((key) => {
          if (this.index[file][key]) {
            search[file][key] = this.index[file][key];
          } return search;
        });
      });
      searchResult.push(search);
    } else {
      term.forEach((key) => {
        if (this.index[fileName][key]) {
          search[fileName][key] = this.index[fileName][key];
        }
      });
      searchResult.push(search);
    }
    return searchResult;
  }

  /**
   * Checks for file Validity
   *
   * @param {JSON} file
   * @returns {boolean} Validity of uploaded file
   *
   * @memberOf InvertedIndex
   */
  static validateFile(file) {
    let check = true;
    try {
      const jsonFile = JSON.parse(JSON.stringify(file));
      if (jsonFile.length === 0) {
        check = false;
      }
      jsonFile.forEach((key) => {
        if (typeof key.title !== 'string' || typeof key.text !== 'string') {
          check = false;
        }
      });
    } catch (error) {
      check = false;
    }
    return check;
  }
}
