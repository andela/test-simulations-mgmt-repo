/**
 * A class to create and search for indexes
 * @class InvertedIndex
 */
class InvertedIndex {

  /**
   * Creates an instance of InvertedIndex.
   * @memberOf InvertedIndex
   */
  constructor() {
    this.index = {};
    this.documentWholeText = {};
    this.documentWholeTitle = {};
    this.documentRange = {};
    this.all = false;
    this.get = false;
    this.search = false;
  }

  /**
   * To validate the content of JSON files
   * @static
   * @param {Object} file - Parsed JSON file
   * @returns {Boolean} True or False
   * @memberOf InvertedIndex
   */
  static validateContent(file) {
    let tempBoolean = true;
    file.forEach((book) => {
      if (typeof (book.title) === 'undefined' || typeof (book.text) === 'undefined') {
        tempBoolean = false;
      }
    });
    if (tempBoolean) {
      return true;
    }
    return false;
  }

  /**
   * Indexes JSON file
   * @param {Object} file - JSON file uploaded into app to be indexed
   * @param {String} fileName - Name of JSON file
   * @returns {Object} - Words as keys and a value of a array with their repective books
   * @memberOf InvertedIndex
   */
  createIndex(file, fileName) {
    const titleObj = {};
    const textObj = {};
    let count = 1;
    file.forEach((book) => {
      titleObj[count] = book.title;
      textObj[count] = book.text;
      count += 1;
    });
    InvertedIndex.transformToSingles(textObj);
    this.documentWholeText[fileName] = this.tokenize(textObj);
    this.documentWholeTitle[fileName] = titleObj;

    return this.documentWholeText[fileName];
  }

  /**
   * To separate words and fix into array
   * @static
   * @param {Object} textObj - Object with all the words together as string
   * @returns {Object} - Object with all the words separated and in array
   * @memberOf InvertedIndex
   */
  static transformToSingles(textObj) {
    Object.keys(textObj).forEach((words) => {
      textObj[words] = textObj[words].replace(/'\w+\s/g, ' ').replace(/[.,/#!+$%^&@*?;:'{}=\-_`~()]/g, '').trim().toLowerCase()
      .split(' ');
    });
    return textObj;
  }

  /**
   * To join words together into array
   * @param {Object} textObj - Object with all the words to be tokenized
   * @returns {Object} - All words together in an array
   * @memberOf InvertedIndex
   */
  transformToArray(textObj) {
    this.textArray = [];
    Object.keys(textObj).forEach((key) => {
      this.textArray = this.textArray.concat(textObj[key]);
    });
    return this.textArray;
  }

  /**
   * To tokenize all words
   * @param {Object} textObj - Object with all the words to be tokenized
   * @returns {Object} - Words as keys and a value of a array with their repective books
   * @memberOf InvertedIndex
   */
  tokenize(textObj) {
    const wordArray = this.transformToArray(textObj);
    this.wordSet = new Set(wordArray);
    this.wordSet = Array.from(this.wordSet).sort();

    this.index = {};
    Object.keys(textObj).forEach((key) => {
      wordArray.forEach((word) => {
        if (textObj[key].includes(word)) {
          if (this.index[word] === undefined) {
            this.index[word] = [];
            this.index[word].push(parseInt(key, 10));
          } else if (this.index[word].includes(parseInt(key, 10))) {
            return;
          } else {
            this.index[word].push(parseInt(key, 10));
          }
        }
      });
    });
    return this.index;
  }

  /**
   * To search through up
   * @param {String} words - Word(s) to be searched through
   * @param {String} indexedFile - JSON file of interest
   * @param {Object} allText - Object containing all text
   * @returns {Object} - Object containin searched words and their locations
   * @memberOf InvertedIndex
   */
  searchIndex(words, indexedFile, allText) {
    this.searchAll = {};
    this.searchText = {};
    words = words.split(/[\s,]+/);
    if (indexedFile === 'All') {
      this.all = true;
      this.get = false;
      this.search = false;
      Object.keys(allText).forEach((key) => {
        const tempObj = {};
        const tempArray = [];
        words.forEach((i) => {
          const word = i;
          tempObj[word] = allText[key][word];
        });
        tempArray.push(tempObj);
        this.searchAll[key] = tempArray;
      });
      return this.searchAll;
    }
    this.get = false;
    this.search = true;
    this.all = false;
    words.forEach((i) => {
      const word = i;
      this.searchText[word] = allText[indexedFile][word];
    });
    return this.searchText;
  }
}
