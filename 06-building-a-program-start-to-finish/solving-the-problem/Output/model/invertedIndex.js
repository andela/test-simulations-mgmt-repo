/**
 * The Inverted Index class
 */
class InvertedIndex {

  /**
   * Constructor initializes indexes as an empty object
   * and keeps track of the files that have been indexed, their titles and their
   * indices in the respective files
   * @constructor
   */
  constructor() {
    this.allIndexed = {};
    this.allTitles = {};
    this.documentsIndex = {};
  }

  /**
   * Create Index
   * createIndex method takes a single document and builds an index from it
   * @param {Object} fileContent - the file content to be indexed
   * @param {String} fileName - the name of the file to be indexed
   * @return {Object} all words in the file and their corresponding indexes
   */
  createIndex(fileContent, fileName) {
    const indexed = {};
    const titles = [];
    fileContent.forEach((book, index) => {
      let text = `${book.title} ${book.text}`;
      titles.push(book.title);
      text = InvertedIndex.tokenize(text);
      text.forEach((word) => {
        if (!(word in indexed)) {
          indexed[word] = [(index)];
        } else if (!(indexed[word].includes(index))) {
          indexed[word].push(index);
        }
      });
    });
    const documents = [];
    titles.forEach((title, index) => {
      documents.push(index);
    });
    this.allIndexed[fileName] = indexed;
    this.allTitles[fileName] = titles;
    this.documentsIndex[fileName] = documents;
    return indexed;
  }

  /**
   * Get Index
   * getIndex method gets the indexed file with words from documents that were
   * found. If the file has not been indexed, it calls the create index method
   * to create the index
   * @param {String} fileName - the name of the file to get indexes
   * @return {Object} all words in the file and their corresponding indexes
   */
  getIndex(fileName) {
    if (fileName in this.allIndexed) {
      return this.allIndexed[fileName];
    }
    return false;
  }

   /**
   * tokenize method removes special characters and returns an array of words
   * @param {string} text - the validated text to be tokenized
   * @return {array} array of words in the document
  */
  static tokenize(text) {
    return text.toLowerCase().match(/[a-z0-9]+/g);
  }

  /**
   * validateFile method ensures all the documents in a file are valid i.e.
   * they should be arrays of objects that have only title and text keys
   * and Strings as value
   * @param {Object} fileContent - the uploaded contents of the file
   * @return {Boolean} true or false if the method was successful or not
  */
  static validateFile(fileContent) {
    if (Array.isArray(fileContent)) {
      for (let item = 0; item < fileContent.length; item += 1) {
        if ((typeof fileContent[item]) !== 'object') {
          return false;
        }
        if (Object.keys(fileContent[item]).length !== 2 ||
            Object.keys(fileContent[item])[0] !== 'title' ||
            Object.keys(fileContent[item])[1] !== 'text') {
          return false;
        }
        if ((typeof fileContent[item].title) !== 'string' ||
            (typeof fileContent[item].text) !== 'string') {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * readFile method reads the data from the file being uploaded
   * @param {JSON} rawFile - the raw uploaded file
   * @return {String} string of text in the uploaded file
  */
  static readFile(rawFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = data => resolve(data.target.result);
      reader.onerror = error => reject(
                      `Error reading ${rawFile.name}: ${error.target.result}`);
      reader.readAsText(rawFile);
    });
  }

  /**
   * searchIndex method searches the indexed files for occurences of words
   * @param {String} words - word(s) that one is searching for
   * @param {String} fileName - file or all files to search through
   * @return {Object} Object with indexes of word(s) in the file(s)
   *                  and other file properties
  */
  searchIndex(words, fileName) {
    const found = [];
    const cleanedTerms = InvertedIndex.tokenize(words);

    if (cleanedTerms === null) {
      return false;
    }

    if (fileName === 'All') {
      const allFiles = Object.keys(this.allIndexed);
      allFiles.forEach((file) => {
        found.push(this.searchOneFile(cleanedTerms, file));
      });
      return found;
    }
    found.push(this.searchOneFile(cleanedTerms, fileName));
    return found;
  }

  /**
   * searchOneFile method searches the indexed file for occurences of words
   * @param {String} words - word(s) that one is searching for
   * @param {String} fileName - specific file you want to search through
   * @return {Object} Object with indexes of word(s) in the file(s)
   *                  and other file properties
  */
  searchOneFile(words, fileName) {
    const result = {};
    words.forEach((term) => {
      result[term] = this.allIndexed[fileName][term];
    });
    return ({
      indexes: result,
      wordsSearchedFor: words.toString(),
      documentIndexes: this.documentsIndex[fileName],
      searchedFile: fileName,
      title: this.allTitles[fileName],
    });
  }
}

