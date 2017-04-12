const hasProperty = Object.prototype.hasOwnProperty;
let instance = null;

/**
 * InvertedIndex class
 * Contains methods for InvertedIndex
 * Only allows single instance of the object to be created
*/
class InvertedIndex {
  /**
    * constructor method ensures that there is only
    * one instance of the class
    * @return {object} - Instance of the class
  */
  constructor() {
    if (!instance) {
      instance = this;
      this.filesIndexed = {};
      this.inputData = {};
      this.error = {};
    }
    return instance;
  }

  /**
   * readFile function is used to get all the index
   * @param {object} inputData - the json data to index
   * @return {boolean} - When file is of bad extent of
   * invalid json format
   * @return {boolean} - When file is of the right extension structure
   */
  readFile(inputData) {
    return new Promise((resolve, reject) => {
      if (!inputData.name.match(/\.json$/)) {
        return reject(false);
      }
      const readFile = new FileReader();
      readFile.readAsText(inputData);
      readFile.onload = (file) => {
        const content = file.target.result;
        try {
          return resolve(JSON.parse(content));
        } catch (exception) {
          return reject(false);
        }
      };
    });
  }

  /**
   * handleError handles error
   * @param {string} fileName - Name of file being indexed or searched
   * @param {string} errorMessage - Error message to be displayed
   * @param {boolean} errorStatus - True or False
   * @return {Object} error - Error Object
   */
  handleError(fileName, errorMessage, errorStatus) {
    delete this.filesIndexed[fileName];
    this.error.status = errorStatus;
    this.error.message = errorMessage;
    throw this.error;
  }

  /**
   * createIndex gets the json ready for indexing by tokenizing statements
   * @param {object} inputData - the json data to index
   * @param {string} filename - the name of the file to be indexed
   * @return {boolean} - true or false if the createIndex was successful
  */
  createIndex(inputData, filename) {
    this.filesIndexed[filename] = {};
    const words = [];
    let documentNum = 0;
    try {
      if (Object.keys(inputData).length < 1) {
        this.handleError(filename, 'File contains no document', true);
      }
      Object.keys(inputData).forEach((eachIndex) => {
        if (!this.validateFile(inputData[eachIndex])) {
          this.handleError(filename, 'Incorrect Document Structure', true);
        }
        words.push(this.getDocumentTokens(inputData, documentNum));
        documentNum += 1;
      });
      this.filesIndexed[filename].numOfDocs = documentNum;
      this.filesIndexed[filename].index = this.constructIndex(words);
      return true;
    } catch (err) {
      if (this.error.status) {
        return false;
      }
    }
  }
  /**
   * validateFile validates the structure of the file uploaded
   * @param {object} docToValidate - The json data to be validated
   * @return {boolean} - True when document has the right structure
   * and False if otherwise
   */
  validateFile(docToValidate) {
    if (!docToValidate.text || !docToValidate.title) {
      return false;
    }
    return true;
  }
  /**
   * getDocumentTokens method gets all the tokens in each document
   * and composes an object out of them
   * @param {object} docDetails - contains the title and text of the document
   * @param {integer} documentNum - the number of the document
   * @return {object} containing the document Number and the token
   */
  getDocumentTokens(docDetails, documentNum) {
    const textTokens = this
      .tokenize(
        `${docDetails[documentNum].text} ${docDetails[documentNum].title}`
      );
    return { documentNum, textTokens };
  }

  /**
   * tokenize: method removes special characters and converts the text to
   * lowercase and then returns the array of words
   * @param {string} text - the text to be tokenized
   * @return {array} array of words in the documents
  */
  tokenize(text) {
    text = text.replace(/[^A-Za-z\s-]/g, '').trim();
    return text.toLowerCase().split(' ');
  }

  /**
   * constructIndex method searches through the array of documents objects and
   * dentifies the words in each
   * @param {array} documents - array of objects, each obect is a document
   * @return {object} objects of tokens. Each token is a key in the object and
   * contains an array of documents in which it was found
  */
  constructIndex(documents) {
    const indexWords = {};
    documents.forEach((eachDoc) => {
      eachDoc.textTokens.forEach((token) => {
        if (!hasProperty.call(indexWords, token)) {
          indexWords[token] = [];
        }
        if (indexWords[token].indexOf(eachDoc.documentNum) === -1) {
          indexWords[token].push(eachDoc.documentNum);
        }
      });
    });
    return indexWords;
  }

  /**
   * getIndex method returns the indexed words and the documents that were found
   * @param {string} filename - name of the file to get its index
   * @return {Object|boolean} the index or false if unable to
  */
  getIndex(filename) {
    try {
      if (!this.filesIndexed[filename]) {
        this.handleError(filename, 'File selected not indexed', false);
      }
      const file = this.filesIndexed[filename];
      return file.index;
    } catch (err) {
      return this.error.status;
    }
  }

  /**
   * searchIndex searches the indexed words to determine the
   * documents that the searchterms can be found
   * @param {array} searchTerm - the search query, array of words
   * @param {string} filename - the name of the file to search its index
   * @return {object|boolean} it returns boolean if the searchTerm is empty and
   * it returns object if it is not. Each index is each searcykeyword.
   * Each with an array value of the document index
  */
  searchIndex(searchTerm, filename) {
    if ((typeof searchTerm === 'string' && searchTerm.trim() === '') ||
      searchTerm === undefined) {
      return false;
    }
    const result = [];
    if (filename === 'all') {
      Object.keys(this.filesIndexed).forEach((eachFile) => {
        result.push({
          indexes: this.getSearchResults(searchTerm, eachFile),
          searchedFile: eachFile,
          documents: this.getDocuments(eachFile)
        });
      });
    } else {
      result.push({
        indexes: this.getSearchResults(searchTerm, filename),
        searchedFile: filename,
        documents: this.getDocuments(filename)
      });
    }
    return result;
  }

  /**
   * getSearchResults method checks the index of the file and returns the result
   * @param {searchTokens} searchTokens - the search query of one or more words
   * @param {string} filename - the name of the file
   * @return {array} result - an array of objects with the found words as keys
  */
  getSearchResults(searchTokens, filename) {
    const indexToSearch = this.getIndex(filename), result = {};
    this.tokenize(searchTokens).forEach((eachSearchWord) => {
      if (indexToSearch[eachSearchWord]) {
        result[eachSearchWord] = indexToSearch[eachSearchWord];
      }
    });
    return result;
  }

  /**
   * getDocuments get an array of the documents index e.g [0, 1, 2, 3]
   * @param {string} filename - name of the file to get its document
   * @return {array} an array of the documents index
  */
  getDocuments(filename) {
    const docs = [];
    for (let i = 0; i < this.filesIndexed[filename].numOfDocs; i += 1) {
      docs.push(i);
    }
    return docs;
  }

}

module.export = InvertedIndex;
