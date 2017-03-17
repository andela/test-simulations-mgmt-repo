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
 *
 *
 * @param {array} indexes
 * @returns {array}
 *
 * @memberOf InvertedIndex
 */
  tokenize(indexes) {
    return indexes.map(word => word.toLowerCase()
      .replace(/[^A-Za-z]/g, '')).sort();
  }

/**
 *
 *
 * @param {string} fileName
 * @param {any} fileContent
 * @returns
 *
 * @memberOf InvertedIndex
 */
  createIndex(fileName, fileContent) {
    const completeIndex = [];
    if (this.validateFile(fileContent)) {
      for (const value of fileContent) {
        const title = value.title;
        const text = value.text;
        const mergeWords = `${title} ${text}`;
        completeIndex.push(this.tokenize(mergeWords.split(' ')));
      }
    }
    return this.storeIndex(fileName, completeIndex);
  }

/**
 *
 *
 * @param {any} fileName
 * @param {any} completeIndex
 * @returns
 *
 * @memberOf InvertedIndex
 */
  storeIndex(fileName, completeIndex) {
    const wordIndex = {};
    for (const index in completeIndex) {
      const indexToInt = parseInt(index, 10);
      completeIndex[index].forEach((word) => {
        if (wordIndex[word]) {
          if (wordIndex[word].indexOf(indexToInt) === -1) {
            wordIndex[word].push(indexToInt);
          }
        } else {
          wordIndex[word] = [indexToInt];
        }
      });
    }
    this.index[fileName] = wordIndex;
    return this.index[fileName];
  }

/**
 *
 *
 * @param {any} fileName
 * @returns
 *
 * @memberOf InvertedIndex
 */
  getIndex(fileName) {
    return this.index[fileName];
  }

/**
 *
 *
 * @param {any} fileName
 * @param {any} term
 * @returns
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
   *
   *
   * @param {any} file
   * @returns
   *
   * @memberOf InvertedIndex
   */
  validateFile(file) {
    this.file = file;
    let check = true;
    try {
      const jsonFile = JSON.parse(JSON.stringify(this.file));
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
