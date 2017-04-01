/**
 * inverted index class
 * @class
**/
class InvertedIndex {
  /**
  * class constructor
  * @constructor
  **/
  constructor() {
    this.fileIndices = {};
    this.searchIndices = {};
  }
  /**
   * Set Index - Sets the indices of all indexed files
   * @param {String} filename - Name of the indexed file
   * @param {Object} indices - Indices of the file
   * @return {object} Indexed file name and it's indices'
  **/
  setIndex(filename, indices) {
    this.fileIndices[filename] = indices;
  }
  /**
   * Validate File
   * It checks if a json file is a json array of json objects
   * @param {Object} file is an array of json objects
   * @return {Boolean} True if a json file is valid and False otherwise
  **/
  static validateFile(file) {
    if (typeof file !== 'object' || file.length === 0 || !Array.isArray(file)) {
      return false;
    }
    for (let i = 0; i < file.length; i += 1) {
      const item = file[i];
      if (!(Object.prototype.hasOwnProperty.call(item, 'title') &&
      (Object.prototype.hasOwnProperty.call(item, 'text')))) {
        return false;
      }
    }
    return true;
  }
  /**
   * Tokenize
   * It splits sentence into an array of refined words
   * @param {String} text - string of texts
   * @return {Array} An array of refined split texts
  **/
  static tokenize(text) {
    const remove = /[^'^\w\s]/g;
    const lowerCase = text.replace(remove, ' ').toLowerCase().split(' ');
    return lowerCase.sort().filter(item => Boolean(item));
  }
  /**
   * Create Index
   * It creates the index of a file
   * @param {String} fileName - Filename of the file to be indexed
   * @param {String} fileContent - Content of the uploaded file
   * @return {Object} An object of each word and their indices in a sorted way
  **/
  createIndex(fileName, fileContent) {
    const indices = {};
    if (InvertedIndex.validateFile(fileContent)) {
      fileContent.forEach((doc, docIndex) => {
        const word = `${doc.title} ${doc.text}`;
        const tokenized = InvertedIndex.tokenize(word);
        tokenized.forEach((token) => {
          if (token in indices) {
            if (indices[token].indexOf(docIndex) === -1) {
              indices[token].push(docIndex);
            }
          } else {
            indices[token] = [docIndex];
          }
        });
      });
      this.setIndex(fileName, indices);
      return 'Index created';
    }
    return 'Index not created';
  }
  /**
   * Get Index
   * It gets the index of a specified filename
   * @param {String} filename - Filename of the index to get
   * @return {Object} An object of each word and their indices in a sorted way
  **/
  getIndex(filename) {
    const result = {};
    const tokens = Object.keys(this.fileIndices[filename]).sort();
    tokens.forEach((token) => {
      result[token] = this.fileIndices[filename][token];
    });
    return result;
  }
   /**
   * Search Index
   * It searches through file(s)
   * @param {String} searchTerm - words to search
   * @param {String} filename - Filename of the index to get
   * @return {Object} Displays table of search result
  **/
  searchIndex(searchTerm, filename) {
    let searchResult = {};
    this.searchIndices = {};
    const tokenizedTerms = InvertedIndex.tokenize(searchTerm);
    let index;
    if (filename !== 'All files') {
      // Search single file with filename
      index = this.fileIndices[filename];
      tokenizedTerms.forEach((term) => {
        if (index[term]) {
          searchResult[term] = index[term];
        }
      });
      this.searchIndices[filename] = searchResult;
      return this.searchIndices;
    }
    // Search all files
    Object.keys(this.fileIndices).forEach((file) => {
      searchResult = {};
      index = this.fileIndices[file];
      tokenizedTerms.forEach((term) => {
        if (index[term]) {
          searchResult[term] = index[term];
        }
      });
      this.searchIndices[file] = searchResult;
    });
    return this.searchIndices;
  }
}

const findIndex = new InvertedIndex();
findIndex.createIndex();
