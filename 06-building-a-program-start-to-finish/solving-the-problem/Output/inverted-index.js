
/**
 * @class InvertedIndex
 */
class InvertedIndexClass {
  /**
   * @constructor
   */
  constructor() {
    this.files = {};
    this.indexTable = {};
  }
  /**
   * createIndex
   * @param {Object} fileName name of file to map index for
   * @return {Boolean} false if index is not created
   */
  createIndex(fileName) {
    const currentFileContent = this.files[fileName];
    this.indexTable[fileName] = this.indexTable[fileName] || {};
    currentFileContent.forEach((document, index) => {
      const documentTitle = document.title;
      const documentText = document.text;
      const normalize = InvertedIndexClass
.tokenize(`${documentText} ${documentTitle}`).sort();
      normalize.forEach((word) => {
        if (word in this.indexTable[fileName]) {
          if (this.indexTable[fileName][word].indexOf(index) === -1) {
            this.indexTable[fileName][word].push(index);
          }
        } else {
          this.indexTable[fileName][word] = [index];
        }
      });
    });
    return true;
  }
  /**
   * getIndex
   * Returns index map of a file
   * @param {String} fileName name of file to return index map
   * @return {Object} a key pair value of file index map
   */
  getIndex(fileName) {
    return this.indexTable[fileName];
  }
  /**
   * tokenization
   * Obtain an array of terms from a string
   * @param {inputData} inputData The filecontent to be tokenized
   * @return {Object} An array of the generated token
   */
  static tokenize(inputData) {
    this.invalidCharacters = /[^a-z0-9\s]/gi;
    return inputData.replace(this.invalidCharacters, ' ')
      .toLowerCase()
      .split(' ')
      .filter(word => (
        word
      ));
  }
  /**
   * searchIndex
   * Search for the occurrence of words in the indexTable
   * @param {String} searchTerms The search term(s)
   * @param {Object} fileNames An array of filenames to search
   * @returns {Object} A map of the search result
   */
  searchIndex(searchTerms, fileNames) {
    const fileTitle = fileNames || Object.keys(this.files);
    this.result = {};
    const allSearchTerms = InvertedIndexClass.tokenize(searchTerms);
    fileTitle.forEach((currentFile) => {
      allSearchTerms.forEach((term) => {
        if (Object.prototype.hasOwnProperty
        .call(this.indexTable[currentFile], term)) {
          if (currentFile in this.result) {
            this.result[currentFile][term] = this.indexTable[currentFile][term];
          } else {
            this.result[currentFile] = {};
            this.result[currentFile][term] = this.indexTable[currentFile][term];
          }
        }
      });
    });
    return Object.keys(this.result).length > 0 ? this.result : false;
  }

  /**
   *validateJsonContent.
   *@param {Object} inputFile The file to be checked
   *@return {Boolean} validity status of the file to be checked
  */
  validateFile(inputFile) {
    this.inputFile = inputFile;
    if (this.inputFile[0].text && this.inputFile[0].title) {
      return this.inputFile;
    }
    return false;
  }
  /**
   * readFile
   * Reads content of JSON and checks for validity
   * @param {Object} inputFile The file to be checked
   * @return {Boolean} validity status of the file checked.
   */
  readFile(inputFile) {
    this.inputFile = inputFile;
    if (typeof inputFile !== 'object' || inputFile.length === 0) {
      return false;
    }

    try {
      inputFile.forEach((thisBook) => {
        const hasTitle = Object.prototype.hasOwnProperty.call(thisBook,
        'title');
        const hasText = Object.prototype.hasOwnProperty.call(thisBook, 'text');
        if (!(hasTitle && hasText)) {
          this.inputFile = null;
        }
      });
      return this.inputFile || false;
    } catch (err) {
      return false;
    }
  }
}


