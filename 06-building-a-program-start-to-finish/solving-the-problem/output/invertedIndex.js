/**
 * @class InvertedIndex
 */
class InvertedIndex {
  /**
   * Class Constructor
   * @constructor
   */
  constructor() {
    this.allIndices = {};
  }
  /**
   * Reads the data from the file being uploaded
   * @param  {File} file - Uploaded file to be read.
   * @return {void}
   */
  static readFile(file) {
    return new Promise((resolve, reject) => {
      const bookReader = new FileReader();
      bookReader.onload = event => resolve(event.target.result);
      bookReader.onerror = (event) => {
        reject(`Error reading + ${this.file.name}: ${event.target.result}`);
      };
      bookReader.readAsText(file);
    });
  }
  /**
   * Ensures all the documents in a particular file is valid
   * @param  {String} fileName
   * @param  {Object} fileContent
   * @return {Boolean} isValid -True or false
   */
  static validateFile(fileName, fileContent) {
    let isValid = true;
    try {
      const parsed = JSON.parse(JSON.stringify(fileContent));
      isValid = (parsed.length <= 0) ||
      (!fileName.toLowerCase().match(/\.json$/g)) ? false : isValid;
      parsed.forEach((key) => {
        if (typeof key.title !== 'string' || typeof key.text !== 'string') {
          isValid = false;
        }
      });
    } catch (error) {
      isValid = false;
    }
    return isValid;
  }
  /**
   * Strips out special characters from documents to be indexed
   * @param  {String} fileText - String from file to be tokenized
   * @return {Array} An array of unique words
   */
  tokenize(fileText) {
    this.text = fileText;
    return [...new Set(this.text
              .toLowerCase()
              .replace(/[^\w\s]/g, '')
              .split(/\s+/)
              .sort()
    )];
  }
  /**
   * Creates the index for documents
   * @param  {String} fileName
   * @param  {Array} content
   * @return {Object} this.allIndices object
   */
  createIndex(fileName, content) {
    const fileIndex = {};
    if (InvertedIndex.validateFile(fileName, content)) {
      content.forEach((fileContent, index) => {
        Object.keys(fileContent).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(fileContent, key)) {
            const tokens = this.tokenize(fileContent[key]);
            tokens.forEach((token) => {
              if (fileIndex[token]) {
                if (fileIndex[token].indexOf(index) === -1) {
                  fileIndex[token].push(index);
                }
              } else {
                fileIndex[token] = [index];
              }
            });
          }
        });
      });
      this.allIndices[fileName] = fileIndex;
      return true;
    }
  }
  /**
   * Get’s indices created for particular files
   * @param  {Object} fileName -Title of input file
   * @return {Object} allIndices
   */
  getIndex(fileName) {
    return this.allIndices[fileName];
  }
  /**
   * Searches through one or more indices for words
   * @param  {String} fileArray -Input file array
   * @param  {String} query -Input token
   * @return {Object} searchResult
   */
  searchIndex(fileArray, query) {
    let index;
    this.searchIndices = {};
    const tokenized = this.tokenize(query);
    if (!fileArray) {
      fileArray = Object.keys(this.allIndices);
    }
    fileArray.forEach((fileName) => {
      const searchResult = {};
      index = this.allIndices[fileName];
      tokenized.forEach((word) => {
        if (index[word]) {
          searchResult[word] = index[word];
        } else {
          searchResult[word] = [];
        }
      });
      this.searchIndices[fileName] = searchResult;
    });
    console.log(this.searchIndices);
    return this.searchIndices;
  }
}
/** App exported as Node package */
if (typeof window === 'undefined') {
  module.exports = InvertedIndex;
}
