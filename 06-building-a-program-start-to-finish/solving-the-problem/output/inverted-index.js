/**
 * Implementation of the inverted index app.
 * @class
 */

class InvertedIndex {
  /**
   * readFile: Reads the contents of file as text
   * @param {file} file - the file to be read
   * @param {string} fileName- the name of the file to be read
   * @return {promise} - promise object to be acted on if file reading is succesful or not
   */

  readFile(file, fileName) {
    this.file = file;
    const validJson = /.+\.json$/;

    if (!validJson.exec(fileName)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (fileBeingRead) => {
        const fileContent = fileBeingRead.target.result;

        try {
          JSON.parse(fileContent);
        } catch (err) {
          reject('This JSON file is invalid. Check the file and try again.');
        }

        resolve(fileContent);
      };

      fileReader.readAsText(this.file);
    });
  }

  /**
   * validateFile: Checks if documents in object have the specified structure of title and text keys
   * @param {Object} file - the object to validate for required structure
   * @throws - throws an error if object doesn't does not have title and text keys
   * @return {Object} - returns object back to caller if object is valid
   */

  validateFile(file) {
    this.file = file;
    this.file.forEach((doc) => {
      if (!(Object.prototype.hasOwnProperty.call(doc, 'title') && Object.prototype.hasOwnProperty.call(doc, 'text'))) {
        throw new Error('Your JSON file does not have the expected format. Documents are to have title and text keys alone.');
      }
    });

    return this.file;
  }

  /**
   * tokenize: Returns an array of valid words in all text fields of file.
   // Also returns an array of valid words in a single string.
   * @param {(Object | string)} - the object whose texts are to be tokenized or string to tokenize
   * @return {array} - array of valid words
   */

  tokenize(file) {
    const validWord = /[a-zA-Z]+/g;
    this.file = file;
    let words = '';
    let found;
    const validWordsArray = [];

    if (typeof (this.file) === 'object') {
      for (let i = 0; i < this.file.length; i += 1) {
        words = words.concat(this.file[i].text + ' ');
      }

      while (found = validWord.exec(words)) {
        validWordsArray.push(found[0]);
      }

      // make the words in array unique and sort them
      return [...new Set(validWordsArray)].sort();
    }

    else if (typeof (this.file) === 'string') {

      while (found = validWord.exec(this.file)) {
        validWordsArray.push(found[0]);
      }

      return validWordsArray;
    }
  }

  /**
   * getTitles: Gets the titles of documents in uploaded file
   * @param {Object} file - the object whose document titles you want to get
   * @return {array} - returns an array of document titles
   */

  getTitles(file) {
    this.file = file;
    const titles = [];
    const texts = [];

    for (let i = 0; i < this.file.length; i += 1) {
      let fileTitle = this.file[i].title;

      if (texts.indexOf(this.file[i].text) === -1) {
        if (titles.indexOf(fileTitle) !== -1) {
          fileTitle += ' - Copy';
        }
        titles.push(fileTitle);
      } else if (titles.indexOf(fileTitle) === -1) {
        titles.push(fileTitle);
      }

      texts.push(this.file[i].text);
    }

    return titles;
  }

  /**
   * getTitles: Turns the text fields of documents to lower case
   * @param {Object} file - the object whose document texts you want to lower
   * @return {Object} - returns the object with its text fields lowered
   */

  lowerDocText(file) {
    this.file = file;
    this.file.forEach((doc) => {
      const eachDoc = doc;
      eachDoc.text = eachDoc.text.toLowerCase();
    });

    return this.file;
  }

  /**
   * createIndex: Creates indices (words and indices of documents they appear in) for a file
   * @param {string} fileName - the name of the file you want to index
   * @param {Object} fileContent - object representing the contents of file
   * @throws - throws an error if object does not conform to required structure
   * @return {array} - returns an array containing indices for file and titles of documents in file
   */

  createIndex(fileName, fileContent) {
    let fileRead;

    try {
      fileRead = this.lowerDocText(fileContent);
    } catch (err) {
      throw new Error('Invalid file format. Only array of objects can be contained in file.');
    }

    this.validateFile(fileRead);

    const indices = {};
    const words = this.tokenize(fileRead);

    words.forEach((word) => {
      const docsWithWord = [];

      fileRead.forEach((doc, docIndex) => {
        // split doc's text into an array to allow whole word checks
        const wordsInDoc = this.tokenize(doc.text);
        if (wordsInDoc.indexOf(word) !== -1) {
          docsWithWord.push(docIndex);
        }
      });

      indices[word] = docsWithWord;
    });

    const fileTitles = this.getTitles(fileContent);

    let indexedDocs = JSON.parse(localStorage.indexedDocs);
    indexedDocs[fileName] = [indices, fileTitles];
    localStorage.indexedDocs = JSON.stringify(indexedDocs);
    return [indices, fileName];
  }

  /**
   * getRecentlyIndexed: Creates indices (words and indices of documents they appear in) for a file
   * @param None
   * @return {array} - returns an array of at most 15 recently indexed files
   */

  getRecentlyIndexed() {
    if (!localStorage.indexedDocs) {
      localStorage.indexedDocs = JSON.stringify({});
    }

    let allRecentlyIndexed = Object.keys(JSON.parse(localStorage.indexedDocs));
    allRecentlyIndexed = allRecentlyIndexed.slice(0, 15);
    return allRecentlyIndexed;
  }

  /**
   * getIndex: Gets index of fileName passed to it from localStorage
   * @param {string} fileName - the name of the file whose index you want to get
   * @return {Object} - returns inverted index stored for file in localStorage
   */

  getIndex(fileName) {
    this.fileName = fileName;
    const fileIndices = JSON.parse(localStorage.indexedDocs)[this.fileName];

    return fileIndices;
  }

  /**
   * getIndex: Gets index of fileName passed to it from localStorage
   * @param {string} fileName - the name of the file whose index you want to get
   * @return {boolean} - checks if any index has been stored in localStorage or not
   */

  indexInLocalStorage() {
    if (Object.keys(JSON.parse(localStorage.indexedDocs)).length === 0) {
      return false;
    }

    return true;
  }

  /**
   * buildSearchResult: Builds search result for fileName in localStorage
   * @param {string} fileName - the name of the file to build search result for
   * @param {string} searchString - the search query (a list of words separated by any delimeter)
   * @return {Object} - object containing search words that appear in index
   */

  buildSearchResult(fileName, searchString) {
    this.fileName = fileName;
    const searchWords = this.tokenize(searchString.toLowerCase());
    const searchResults = {};
    const indexOfFile = JSON.parse(localStorage.indexedDocs)[this.fileName][0];

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
   * searchIndex: Searches created indices for words in search string
   * @param {string} fileName - the name of the file to build search result for
   * @param {string} searchString - the search query (a list of words separated by any delimeter)
   * @param {Object} indexedFiles - object containing more than one file names and their indices
   * @return {Object} - object containing search words that appear in index
   */

  searchIndex(fileName, searchString, indexedFiles) {
    this.fileName = fileName;
    this.searchString = searchString.toLowerCase();

    if (this.fileName === 'All Files') {
      const resultForFile = {};
      const allFiles = Object.keys(indexedFiles);

      allFiles.forEach((file) => {
        resultForFile[file] = this.buildSearchResult(file, searchString);
      });

      return resultForFile;
    }

    return this.buildSearchResult(this.fileName, this.searchString);
  }

  /**
   * deleteIndex: Deletes the specified fileName from localStorage
   * @param {string} fileName - the name of the file you want to delete
   * @return {string}
   */

  deleteIndex(fileName) {
    this.fileName = fileName;

    if (fileName === 'Delete All') {
      localStorage.indexedDocs = JSON.stringify({});
    } else {
      const fileIndices = JSON.parse(localStorage.indexedDocs);
      delete fileIndices[this.fileName];
      localStorage.indexedDocs = JSON.stringify(fileIndices);
    }

    return 'File index deleted';
  }

}
