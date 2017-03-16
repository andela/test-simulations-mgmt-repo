/**
 * Inverted index class
 */
class InvertedIndex {
  /**
   * Inverted index constructor
   */
  constructor() {
    // Object to hold the index
    this.index = {};
  }

  /**
   * strips words of all special characters and numbers
   * and returns an Array of each words
   * @param{String} words - String to tokenize
   * @return{Array} list of words devoid of special characters or symbols
   */
  static tokenize(words) {
    return words.trim().replace(/-/g, ' ')
      .replace(/[^A-z\s]/g, '')
      .toLowerCase()
      .split(' ')
      .sort();
  }

  /**
   * remove duplicate words in tokenize array
   * @param{String} words - The string to be filtered
   * @return{Array} tokens - Without duplicated words
   */
  static uniqueWords(words) {
    const tokens = InvertedIndex.tokenize(words);
    return tokens.filter((item, index) => tokens.indexOf(item) === index);
  }

  /**
   * creates an inverted index
   * takes a file name and array of words as
   * argument and creates inverted index
   * @param{String} fileName - The name of the file to be indexed
   * @param{Array} fileToIndex - Array of contents of the JSON file to index
   * @return{String} for invalid files - JSON file is Empty
   * @return{Object || String} for valid files returns
   * index - That maps words to locations(documents)
   * while for empty files returns JSON file is empty
   */
  createIndex(fileName, fileToIndex) {
    const wordsToIndex = [];
    const fileIndex = {};
    const fileLength = fileToIndex.length;
    if (fileLength === 0) {
      return 'JSON file is Empty';
    }
    fileToIndex.forEach((document) => {
      if (document.text && document.title) {
        wordsToIndex
          .push(`${document.text
            .toLowerCase()}`);
      }
    });
    const uniqueContent = InvertedIndex.uniqueWords(wordsToIndex.join(' '));
    uniqueContent.forEach((word) => {
      fileIndex[word] = [];
      wordsToIndex.forEach((document, indexPosition) => {
        if (document.indexOf(word) > -1) {
          fileIndex[word].push(indexPosition);
        }
      });
    });
    this.index[fileName] = fileIndex;
  }

  /** gets an indexed file
   * takes an indexed file as argument and return the indexes of the
   * file
   * @param{String} fileName - The name of the file whose index is required
   * @return{Object} index - The correct mapping of words
   *  to locations for specified file
   */
  getIndex(fileName) {
    const file = this.index[fileName];
    return file || 'index does not exist';
  }

  /** search inverted index
   * takes a string of words to search with the fileName
   * and returns an object with words mapped
   * to document locations
   * @param{String} searchQuery - Words to search for
   * @param{String} fileName - file to query
   * @return{Object} searchResults - Maps searched words to document locations
   * or 'no query to search' for invalid query
   */
  searchIndex(searchQuery, fileName) {
    const fileToSearch = this.getIndex(fileName) || Object.keys(this.index);
    const searchResult = {};
    if (!searchQuery || typeof fileToSearch === 'string') {
      return 'no query to search';
    }
    InvertedIndex.uniqueWords(searchQuery).forEach((word) => {
      if (Array.isArray(fileToSearch[word])) {
        searchResult[word] = fileToSearch[word];
      } else {
        searchResult[word] = [];
      }
    });
    return searchResult;
  }

  /** search inverted index
   * takes a string of words to search
   * and returns an object with words mapped
   * to document locations inside their file object
   * @param{String} searchQuery - Words to search for
   * @return{Object} searchResults - Maps searched words to document locations
   * or 'no query to search' for invalid query 
   */
  searchAllIndex(searchQuery) {
    const searchResult = {};
    if (!searchQuery) {
      return 'no query to search';
    }
    const indexedWords = Object.keys(this.index);
    indexedWords.forEach((fileName) => {
      searchResult[fileName] = this.searchIndex(searchQuery, fileName);
    });
    return searchResult;
  }

}

module.exports = InvertedIndex;
