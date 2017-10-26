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
    this.indexes = {};
  }

  /**
   * Validate File
   * @function
   * @param {string} filedata content of the file uploaded
   * @return {Boolean} true if file is valid and false otherwise
   */
  static validate(filedata) {
    if ((Array.isArray(filedata) && filedata.length > 0)) {
      let flag = true;
      filedata.forEach((doc) => {
        if ((doc.title && doc.text) === undefined) {
          flag = false;
        }
      });
      return flag;
    }
    return false;
  }

  /**
   * Get individual words from a string of text.
   * @function
   * @param {String} text text to be getWords.
   * @return {Array} array of string tokens
   */
  static getWords(text) {
    return text.toLowerCase()
    .replace(/[^\w\s]/g, '').split(/\s+/);
  }

  /**
   * Create index
   * @function
   * @param {string} filename
   * @param {Array} filedata
   * @return {Object} index object
   */
  createIndex(filename, filedata) {
    const dictionary = {};
    filedata.forEach((doc, arrayIndex) => {
      const docWords = doc.text;
      const words = InvertedIndex.getWords(docWords);

      words.forEach((word) => {
        if (dictionary[word]) {
          if (dictionary[word].indexOf(arrayIndex) === -1) {
            dictionary[word].push(arrayIndex);
          }
        } else {
          dictionary[word] = [arrayIndex];
        }
      });
    });

    this.indexes[filename] = {
      words: dictionary,
      docCount: filedata.length
    };
  }

  /**
   * Get a particular index
   * @function
   * @param {String} filename
   * @return {Object} index object
   */
  getIndex(filename) {
    return this.indexes[filename];
  }

  /**
   * Search Index.
   * @function
   * @param {String} query query string
   * @param {String} filename filename of index to be searched.
   * @returns {Object|String} search result object.
   */
  searchIndex(query, filename) {
    const queryWords = InvertedIndex.getWords(query);
    const index = this.getIndex(filename);

    if (!index) {
      return `Index with ${filename} does not exist.`;
    }

    const result = {
      words: {},
      docCount: index.docCount
    };

    queryWords.forEach((word) => {
      if (index.words[word]) {
        result.words[word] = index.words[word];
      }
    });
    return result;
  }

  /**
   * Search Index.
   * @function
   * @param {String} query query string
   * @returns {Object|String} search result object.
   */
  searchAllIndexes(query) {
    const result = {};

    Object.keys(this.indexes).forEach((filename) => {
      result[filename] = this.searchIndex(query, filename);
    });

    return result;
  }

}
