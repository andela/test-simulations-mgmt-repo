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
      this.fileContent = {};
      this.error = {};
    }
    return instance;
  }

  /**
   * readFile read file from a given html element
   * @param {object} fileContent - the json data to index
   * @return {object|boolean} - When file have bad extension it returns
   * false and return a json object if it is a good extension
   */
  static readFile(fileContent) {
    return new Promise((resolve, reject) => {
      if (!fileContent.name.match(/\.json$/)) {
        return reject(false);
      }
      const readFile = new FileReader();
      readFile.readAsText(fileContent);
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
    this.error.filename = fileName;
    throw this.error;
  }

  /**
   * createIndex gets the json ready for indexing by tokenizing statements
   * @param {object} fileContent - the json data to index
   * @param {string} fileName - the name of the file to be indexed
   * @return {boolean} - true or false if the createIndex was successful
  */
  createIndex(fileContent, fileName) {
    this.filesIndexed[fileName] = {};
    const words = [];
    let documentCount = 0;
    if (InvertedIndex.validateFile(fileContent)) {
      Object.keys(fileContent).forEach(() => {
        words.push(InvertedIndex
          .getDocumentTokens(fileContent, documentCount));
        documentCount += 1;
      });
      this.filesIndexed[fileName].documentCount = documentCount;
      this.filesIndexed[fileName].index = InvertedIndex.constructIndex(words);
      return true;
    }
    return false;
  }
  /**
   * validateFile if file has content and
   * validates the structure of the file uploaded
   * @param {object} fileContent - The json data to be validated
   * @return {boolean} - True when document has the right structure
   * and False if otherwise
   */
  static validateFile(fileContent) {
    try {
      if (Object.keys(fileContent).length < 1) {
        this.handleError(fileContent[fileName],
          'File contains no document', true);
      }
      Object.keys(fileContent).forEach((eachIndex) => {
        if (!fileContent[eachIndex].text || !fileContent[eachIndex].title) {
          this.handleError(fileContent[fileName],
            'Incorrect Document Structure', true);
        }
      });
      return true;
    } catch (err) {
      return false;
    }
  }
  /**
   * getDocumentTokens method gets all the tokens in each document
   * and composes an object out of them
   * @param {object} documentDetails - contains
   * the title and text of the document
   * @param {integer} documentCount - the number of the document
   * @return {object} containing the document Number and the token
   */
  static getDocumentTokens(documentDetails, documentCount) {
    const textTokens = InvertedIndex.tokenize(
        `${documentDetails[documentCount].text} 
          ${documentDetails[documentCount].title}`
      );
    return { documentCount, textTokens };
  }

  /**
   * tokenize: method removes special characters and converts the text to
   * lowercase and then returns the array of words
   * @param {string} text - the text to be tokenized
   * @return {array} array of words in the documents
  */
  static tokenize(text) {
    let splittedWords = text.replace(/[^A-Za-z\s+]/g, '').trim()
      .toLowerCase().split(/\b\s+(?!$)/);
    splittedWords = splittedWords.filter(eachWords => eachWords !== '');
    return splittedWords;
  }

  /**
   * constructIndex method searches through the array of documents objects and
   * identifies the words in each
   * @param {array} documents - array of objects, each obect is a document
   * @return {object} objects of tokens. Each token is a key in the object and
   * contains an array of documents in which it was found
  */
  static constructIndex(documents) {
    const indexWords = {};
    documents.forEach((eachDocument) => {
      eachDocument.textTokens.forEach((token) => {
        if (!hasProperty.call(indexWords, token)) {
          indexWords[token] = [];
        }
        if (indexWords[token].indexOf(eachDocument.documentCount) === -1) {
          indexWords[token].push(eachDocument.documentCount);
        }
      });
    });
    return indexWords;
  }

  /**
   * getIndex method returns the indexed words and the documents that were found
   * @param {string} fileName - name of the file to get its index
   * @return {Object|boolean} the index or false if unable to
  */
  getIndex(fileName) {
    try {
      if (!this.filesIndexed[fileName]) {
        this.handleError(fileName, 'File selected not indexed', false);
      }
      const file = this.filesIndexed[fileName];
      return file.index;
    } catch (err) {
      return false;
    }
  }

  /**
   * searchIndex searches the indexed words to determine the
   * documents that the searchterms can be found
   * @param {array} searchTerm - the search query, array of words
   * @param {string} fileName - the name of the file to search its index
   * @return {object|boolean} it returns boolean if the searchTerm is empty and
   * it returns object if it is not. Each index is each searcykeyword.
   * Each with an array value of the document index
  */
  searchIndex(searchTerm, fileName) {
    if ((typeof searchTerm === 'string' && searchTerm.trim() === '') ||
      searchTerm === undefined) {
      return false;
    }
    const result = [];
    if (fileName === 'all') {
      Object.keys(this.filesIndexed).forEach((eachFile) => {
        result.push({
          indexes: this.getSearchResults(searchTerm, eachFile),
          searchedFile: eachFile,
          documents: this.getDocuments(eachFile)
        });
      });
    } else {
      result.push({
        indexes: this.getSearchResults(searchTerm, fileName),
        searchedFile: fileName,
        documents: this.getDocuments(fileName)
      });
    }
    return result;
  }

  /**
   * getSearchResults method checks the index of the file and returns the result
   * @param {searchTokens} searchTokens - the search query of one or more words
   * @param {string} fileName - the name of the file
   * @return {array} result - an array of objects with the found words as keys
  */
  getSearchResults(searchTokens, fileName) {
    const indexToSearch = this.getIndex(fileName) || {}, result = {};
    const tokens = InvertedIndex.tokenize(searchTokens);

    for (let i = 0; i <= tokens.length; i += 1) {
      if (indexToSearch[tokens[i]]) {
        result[tokens[i]] = indexToSearch[tokens[i]];
      }
    }
    return result;
  }

  /**
   * getDocuments get an array of the documents index e.g [0, 1, 2, 3]
   * @param {string} fileName - name of the file to get its document
   * @return {array} an array of the documents indexed
  */
  getDocuments(fileName) {
    const documents = [];
    for (let i = 0; i < this.filesIndexed[fileName].documentCount; i += 1) {
      documents.push(i);
    }
    return documents;
  }

}

