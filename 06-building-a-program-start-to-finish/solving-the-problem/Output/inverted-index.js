//**
 * Inverted Index class
 */
class InvertedIndex {
/**
 * class constructor
 */
  constructor() {
    this.indices = {};
    this.documentCount = 0;
  }
/**
 * normalizeText takes a string with numbers,
 * spaces and symbols and returns a normalized string
 * @param{String} text - The name of the string to be normalized
 * @return{Array} Array of normalized text
 */
  static normalizeText(text) {
    return (text.toLowerCase().match(/[A-Za-z]+/g).sort());
  }
/**
 * @param{String} words - String to be filtered
 * @return{Array} token - Array without duplicate words
 */
  static uniqueWords(words) {
    const tokens = InvertedIndex.normalizeText(words);
    return tokens.filter((item, index) =>
                tokens.indexOf(item) === index);
  }
  /**
   * isValidFile checks the validity of uploaded files
   * @param {Object} file the selected file
   * @returns {Boolean} check - returns true for valid files
   * and false for invalid files.
   */
  static isValidFile(file) {
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
/**
 * createIndex takes a document and builds an index out of it
 * @param{String} fileName - The name of the file to be indexed
 * @param{Array} fileContent - The content of the file to be indexed
 * @return{Array} indices - Maps words to their location
 */
  createIndex(fileName, fileContent) {
    const indexedFile = {};
    const wordsToIndex = [];
    if (InvertedIndex.isValidFile(fileContent)) {
      fileContent.forEach((document) => {
        this.documentCount += 1;
        if (document.text) {
          wordsToIndex.push(`${document.title} ${document.text}`.toLowerCase());
        }
      });
    }
    const uniqueContent = InvertedIndex.uniqueWords(wordsToIndex.join(' '));
    uniqueContent.forEach((word) => {
      indexedFile[word] = [];
      wordsToIndex.forEach((document, index) => {
        if (document.includes(word)) {
          indexedFile[word].push(index);
        }
      });
    });
    this.indices[fileName] = indexedFile;
  }
/**
 * @param{String} fileName - The name of the file
 * whose index is required
 * @return{Object} indices - The correct mapping of words to
 * locations for specified file
 */
  getIndex(fileName) {
    return this.indices[fileName];
  }
/**
 * @param{String} query - Words to search for
 * @param{String} indexToSearch - Index to query
 * @return{Object} searchResult - Maps searched words
 * to document locations
 */
  searchIndex(query, indexToSearch) {
    const searchResult = {};
    const searchTerms = InvertedIndex.uniqueWords(query);
    searchTerms.forEach((word) => {
      const errorMessage =
      ` We are Sorry but ${word} is not found in our database`;
      if (indexToSearch) {
        searchResult[word] = this.indices[indexToSearch][word] ?
          this.indices[indexToSearch][word] : errorMessage;
      } else {
        return 'Choose a filename';
      }
    });
    return searchResult;
  }
  /**
   * @param{String} query - Words to search for
   * @return{Object} searchResult - Maps searched words
   */
  searchAll(query) {
    const searchResult = {};
    Object.keys(this.indices).forEach((fileName) => {
      searchResult[fileName] = this.searchIndex(query, fileName);
    });
    return searchResult;
  }
}
module.exports = InvertedIndex;
