/**
 * Implementation of the inverted index app.
 * @class
 */
const InvertedIndex = class {
  /**
   * @desc Initializes indexedFiles object
   * @constructor
   */
  constructor() {
    this.indexedFiles = {};
  }

  /**
   * @desc readFile: Reads the contents of file as text
   * @param {file} file - the file to be read
   * @param {string} fileName - the name of the file to be read
   * @return {promise|Boolean} - promise object to be acted on if file
   * reading is succesful or not or false if file is invalid
   */
  static readFile(file, fileName) {
    const validJson = /.+\.json$/;
    if (!validJson.exec(fileName)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (fileReadEvent) => {
        const fileContent = fileReadEvent.target.result;
        try {
          JSON.parse(fileContent);
        } catch (err) {
          reject('This JSON file is invalid. Check the file and try again.');
        }

        resolve(fileContent);
      };

      fileReader.readAsText(file);
    });
  }

  /**
   * @desc validateFile: Checks if documents
   *  in object have the specified structure of title and text keys
   * @param {Object} fileContent
   * - the object to validate for required structure
   * @throws
   * - throws an error if object doesn't does not have title and text keys
   * @return {Object} - returns object back to caller if object is valid
   */
  static validateFile(fileContent) {
    if (!Array.isArray(fileContent)) {
      throw new Error(`This file's structure is invalid.
       Only array of objects are allowed.`);
    }

    fileContent.forEach((document) => {
      if (!(Object.prototype.hasOwnProperty.call(document, 'title')
      && Object.prototype.hasOwnProperty.call(document, 'text'))) {
        throw new Error(`Your JSON file does not have the expected format.
          Documents are to have title and text keys alone.`);
      }
    });

    return fileContent;
  }

  /**
   * @desc tokenize: Returns an array of valid words in all text fields of file.
     Also returns an array of valid words in a single string.
   * @param {(Object | String)} fileContent - object or string to be tokenized
   - the object whose texts are to be tokenized or string to tokenize
   * @return {array} - array of valid words
   */
  static tokenize(fileContent) {
    const validWord = /[a-zA-Z]+/g;
    let words = '';
    let validWordsArray = [];

    if (typeof (fileContent) === 'object') {
      fileContent.forEach((eachDocument) => {
        // concatenate texts of documents into a single string
        words = words.concat(`${eachDocument.text} `);
      });

      validWordsArray = words.match(validWord);
      // make the words in array unique and sort them
      return [...new Set(validWordsArray)].sort();
    } else if (typeof fileContent === 'string') {
      validWordsArray = fileContent.match(validWord);
    }

    return validWordsArray;
  }

  /**
   * @desc getTitles: Gets the titles of documents in uploaded file
   * @param {Object} fileContent
      - the object whose document titles you want to get
   * @return {array} - returns an array of document titles
   */
  static getTitles(fileContent) {
    const titles = [];
    const texts = [];
    fileContent.forEach((eachDocument) => {
      const fileTitle = eachDocument.title;
      if (texts.indexOf(eachDocument.text) === -1) {
        titles.push(fileTitle);
      } else if (titles.indexOf(fileTitle) === -1) {
        titles.push(fileTitle);
      }

      texts.push(eachDocument.text);
    });

    return titles;
  }

  /**
   * @desc lowerDocumentText: Turns the text fields of documents to lower case
   * @param {Object} fileContent
      - the object whose document texts you want to lower
   * @return {Object} - returns the object with its text fields lowered
   */
  static lowerDocumentText(fileContent) {
    fileContent.forEach((document) => {
      document.text = document.text.toLowerCase();
    });

    return fileContent;
  }

  /**
   * @desc createIndex:
   Creates indices (words and indices of documents they appear in) for a file
   * @param {string} fileName - the name of the file you want to index
   * @param {Object} fileContent - object representing the contents of file
   * @throws - throws an error if object does not conform to required structure
   * @return {array} - returns an array
    containing indices for file and titles of documents in file
   */
  createIndex(fileName, fileContent) {
    InvertedIndex.validateFile(fileContent);
    const jsonContent = InvertedIndex.lowerDocumentText(fileContent);
    const indices = {};
    const words = InvertedIndex.tokenize(jsonContent);

    words.forEach((word) => {
      const documentsWithWord = [];
      jsonContent.forEach((document, documentIndex) => {
        // split doc's text into an array to allow whole word checks
        const wordsInDocument = InvertedIndex.tokenize(document.text);
        if (wordsInDocument.indexOf(word) !== -1) {
          documentsWithWord.push(documentIndex);
        }
      });

      indices[word] = documentsWithWord;
    });

    const fileTitles = InvertedIndex.getTitles(fileContent);
    this.indexedFiles[fileName] = [indices, fileName, fileTitles];
    return this.indexedFiles;
  }

  /**
   * @desc buildSearchResult: Builds search result for fileName
   * @param {string} fileName - the name of the file to build search result for
   * @param {string} searchString - the search query to perform search on
   * @param {Object} indexedFiles - indexed files to search through
   - the search query (a list of words separated by any delimeter)
   * @return {Object} - object containing search words that appear in index
   */
  static buildSearchResult(fileName, searchString, indexedFiles) {
    const searchWords = InvertedIndex.tokenize(searchString.toLowerCase());
    const searchResults = {};
    const indexOfFile = indexedFiles[fileName][0];

    searchWords.forEach((searchItem) => {
      Object.keys(indexOfFile).forEach((word) => {
        if (word.indexOf(searchItem) > -1) {
          searchResults[word] = indexOfFile[word];
        }
      });
    });

    return searchResults;
  }

  /**
   * @desc searchIndex: Searches created indices for words in search string
   * @param {string} fileName - the name of the file to build search result for
   * @param {string} searchString
   - the search query (a list of words separated by any delimeter)
   * @param {Object} indexedFiles
   - object containing more than one file names and their indices
   * @return {Object} - object containing search words that appear in index
   */
  static searchIndex(fileName, searchString, indexedFiles) {
    searchString = searchString.toLowerCase();
    if (fileName === 'All Files') {
      const resultForFile = {};
      const allFiles = Object.keys(indexedFiles);
      allFiles.forEach((file) => {
        resultForFile[file] =
            InvertedIndex.buildSearchResult(file, searchString, indexedFiles);
      });

      return resultForFile;
    }

    return InvertedIndex.buildSearchResult(fileName,
       searchString, indexedFiles);
  }
};
