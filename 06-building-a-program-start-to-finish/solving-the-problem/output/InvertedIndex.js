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
   * To validate the content of the uploaded JSON files
   * @static
   * @param {Object} jsonFile - Parsed JSON file
   * @returns {Boolean} True or False
   * @memberOf InvertedIndex
   */
  static validateContent(jsonFile) {
    let isValid = true;
    jsonFile.forEach((book) => {
      if (typeof book.title === 'undefined'
      || typeof book.text === 'undefined') {
        isValid = false;
      }
    });
    return isValid; // use flag instead
  }

  /**
   * Indexes JSON file
   * @param {Object} fileContent - JSON file uploaded into app to be indexed
   * @param {String} fileName - Name of JSON file
   * @returns {Object} - Words as keys and a value of a array with
   * their repective books
   * @memberOf InvertedIndex
   */
  createIndex(fileContent, fileName) {
    const titleObj = {};
    const textObj = {};
    let count = 1;
    fileContent.forEach((book) => {
      titleObj[count] = book.title;
      textObj[count] = book.text;
      count += 1;
    });
    Object.keys(textObj).forEach((words) => {
      textObj[words] = textObj[words].replace(/'\w+\s/g, ' ')
      .replace(/[.,/#!+$%^&@*?;:'{}=\-_`~()]/g, '').trim().toLowerCase()
      .split(' ');
    });
    this.documentWholeText[fileName] = this.populateIndex(textObj);
    this.documentWholeTitle[fileName] = titleObj;

    return this.documentWholeText[fileName];
  }

  /**
   * To join all words together into array
   * @param {Object} textObj - Object with all the words to be tokenized
   * @returns {Object} - All words together in an array
   * @memberOf InvertedIndex
   */
  normalizeAllText(textObj) {
    this.textArray = [];
    Object.keys(textObj).forEach((key) => {
      this.textArray = this.textArray.concat(textObj[key]);
    });
    return this.textArray;
  }

  /**
   * To populate the index object
   * @param {Object} textObj - Object with all the words to be tokenized
   * @returns {Object} - Words as keys and a value of a array with their
   * repective books
   * @memberOf InvertedIndex
   */
  populateIndex(textObj) {
    const wordArray = this.normalizeAllText(textObj);
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
            return undefined;
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
   * @param {String} indexedFileName - JSON file of interest
   * @param {Object} allText - Object containing all text
   * @returns {Object} - Object containin searched words and their locations
   * @memberOf InvertedIndex
   */
  searchIndex(words, indexedFileName, allText) {
    this.searchAll = {};
    this.searchText = {};
    this.get = false;
    words = words.split(/[\s,]+/);
    if (indexedFileName === 'All') {
      this.all = true;
      this.search = false;
      Object.keys(allText).forEach((key) => {
        const tempObj = {};
        const tempArray = [];
        words.forEach((word) => {
          tempObj[word] = allText[key][word];
        });
        tempArray.push(tempObj);
        this.searchAll[key] = tempArray;
      });
      return this.searchAll;
    }
    this.search = true;
    this.all = false;
    words.forEach((word) => {
      this.searchText[word] = allText[indexedFileName][word];
    });
    return this.searchText;
  }
}
