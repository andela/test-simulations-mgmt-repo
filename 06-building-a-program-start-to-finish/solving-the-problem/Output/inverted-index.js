/**
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
 * normalizedText takes a string with numbers,
 * spaces and symbols and returns a normalized string
 * @param{String} text - The name of the string to be normalized
 * @return{String} normalized string
 */
  normalizedText(text) {
    this.text = text;
    return this.text.toLowerCase().match(/[A-Za-z]+/g,
      matched => matched.sort());
  }
/**
 * @param{String} words - String to be filtered
 * @return{Array} token - Array without duplicate words
 */
  uniqueWords(words) {
    this.words = words;
    const tokens = this.normalizedText(this.words);
    return tokens.filter((item, index) =>
                tokens.indexOf(item) === index);
  }
  /**
   * Validate File
   * @param {Object} file the selected file
   * @returns {String} validation message
   */
  isValidFile(file) {
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
/**
 * createIndex takes a document and builds an index out of it
 * @param{String} fileName - The name of the file to be indexed
 * @param{Array} fileContent - The content of the file to be indexed
 * @return{Array} indices - Maps words to their location
 */
  createIndex(fileName, fileContent) {
    const indexedFile = {};
    const wordsToIndex = [];
    if (this.isValidFile(fileContent)) {
      fileContent.forEach((document) => {
        this.documentCount += 1;
        if (document.text) {
          wordsToIndex.push(`${document.title} ${document.text}`.toLowerCase());
        }
      });
    }
    const uniqueContent = this.uniqueWords(wordsToIndex.join(' '));
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
    const multipleFileResults = [];
    let singleSearchResult = {};
    const searchTerms = this.uniqueWords(query);
    searchTerms.forEach((word) => {
      const errorMessage =
      ` We are Sorry but ${word} is not found in our database`;
      if (indexToSearch) {
        this.indices[indexToSearch][word] ?
        (singleSearchResult[word] = this.indices[indexToSearch][word]) :
        (singleSearchResult[word] = errorMessage);
      } else {
        Object.keys(this.indices).forEach((key) => {
          this.indices[key][word] ?
          (singleSearchResult[word] = this.indices[key][word]) :
          (singleSearchResult[word] = errorMessage);
          multipleFileResults.push(singleSearchResult);
          singleSearchResult = {};
        });
      }
    });
    return (multipleFileResults.length === 0 ?
    singleSearchResult : multipleFileResults);
  }
}
module.exports = InvertedIndex;
