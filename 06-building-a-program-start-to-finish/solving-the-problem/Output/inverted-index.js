/**
 * Implementation of the inverted index data structure.
 * @author Omokaro Faith <faith.omokaro@andela.com>
*/
class InvertedIndex {
  /**
   * Creates an instance of InvertedIndex.
   * @constructor
   */
  constructor() {
    this.index = {};
    this.temp_search = [];
    this.searchResult = {};
    this.allIndex = {};
    this.token = '';
  }
/**
     * It returns the words passed in small letters and spaces removed
     * @method tokenize
     * @param {string} words
     * @return {String} this.token
     */
  tokenize(words) {
    this.token = words.replace(/,+/g, ' ')
    .replace(/[^a-zA-Z 0-9\s]+/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
    return this.token;
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
   * It validates the file passed and returns the error message
   *
   * @method validateFile
   * @param {String} file
   *
   * @return {object} validates the file passed
   */
  static validateFile(file) {
    const jsonFile = file;
    let check = {
      status: true,
      msg: 'This is a valid File',
    };
    if (!Array.isArray(file) || file.length < 1) {
      check = {
        status: false,
        msg: 'File is empty upload a file',
      };
    } else {
      jsonFile.forEach((key) => {
        if (key.title === undefined || key.text === undefined) {
          check = {
            status: false,
            msg: 'Invalid file content',
          };
        }
      });
    }
    return check;
  }
/**
     * It returns the index of the file passed
     *
     * @method createIndex
     * @param {Object} fileName
     * @param {Object} obj
     *
     * @return {void}
     */
  createIndex(fileName, obj) {
    const newIndex = {};
    obj.forEach((object, position) => {
      const longSentence = `${object.title} ${object.text}`;
      const tokenized = this.tokenize(longSentence);
      const wordArray = tokenized.split(' ');

      wordArray.forEach((word) => {
        if (newIndex[word] === undefined) {
          newIndex[word] = [position];
        } else if (newIndex[word].indexOf(position) < 0) {
          newIndex[word].push(position);
        }
      });
    });
    this.index[fileName] = newIndex;
  }
/**
     * It returns the index of the words
     * @method getIndex
     * @param {Object} fileName
     *
     * @return {object} gets the index
     */
  getIndex(fileName) {
    if (Object.keys(fileName).length < 1) {
      return this.index;
    }

    return this.index[fileName];
  }
  /**
   * @method flattenSearch
   * @param {void} arguments of terms
   * @return {Array} array of terms
   */
  flattenSearch(...args) {
    return args.reduce((acc, val) =>
      acc.concat(Array.isArray(val) ?
      this.flattenSearch(val) : val.split(' ')), []);
  }
/**
     * it returns the word searched for in the object it was found
     *
     * @method searchIndex
     * @param {String} searchTerms
     * @param {String} fileName
     *
     * @returns {Object} search result
     */
  searchIndex(searchTerms, fileName) {
    let searchResult = {};
    const allIndex = {};
    if (fileName !== 'All files') {
      const selectedIndex = this.index[fileName];
      let terms = this.tokenize(searchTerms);
      terms = this.flattenSearch(searchTerms);
      terms.forEach((term) => {
        if (selectedIndex) {
          Object.keys(selectedIndex).forEach((savedWord) => {
            if (savedWord === term) {
              searchResult[savedWord] = selectedIndex[savedWord];
            }
          });
        }
      });
      return searchResult;
    }
    Object.keys(this.index).forEach((filename) => {
      searchResult = {};
      const selectedIndex = this.index[filename];
      let terms = this.tokenize(searchTerms);
      terms = this.flattenSearch(terms);
      terms.forEach((term) => {
        if (selectedIndex) {
          Object.keys(selectedIndex).forEach((savedWord) => {
            if (savedWord === term) {
              searchResult[savedWord] = selectedIndex[savedWord];
            }
          });
        }
      });
      allIndex[filename] = searchResult;
    });
    return allIndex;
  }
}

module.exports = InvertedIndex;
