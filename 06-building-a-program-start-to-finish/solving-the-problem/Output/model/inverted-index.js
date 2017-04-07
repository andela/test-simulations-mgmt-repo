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
      text = this.tokenize(text);
      text.forEach((word) => {
        if (!(word in indexed)) {
          indexed[word] = [(index)];
        } else if (!(indexed[word].includes(index))) {
          indexed[word].push(index);
        }
      });
    });
    const documents = [];
    for (let i = 0; i < titles.length; i += 1) {
      documents.push(i);
    }
    this.allIndexed[fileName] = indexed;
    this.allTitles[fileName] = titles;
    this.documentsIndex[fileName] = documents;
    return indexed;
  }

  /**
   * Get Index
   * getIndex method gets the indexed file with words from documents that were
   * found. If the file has not been indexed, it calls the create index method
   * @param {Object} fileContent - the file content we want to get indexed
   * @param {String} filename - the name of the file to be indexed
   * @return {Object} all words in the file and their corresponding indexes
   */
  getIndex(fileContent, fileName) {
    if (fileName in this.allIndexed) {
      return this.allIndexed[fileName];
    }
    return this.createIndex(fileContent, fileName);
  }

   /**
   * tokenize method removes special characters and returns an array of words
   * @param {string} text - the validated text to be tokenized
   * @return {array} array of words in the document
  */
  tokenize(text) {
    this.text = text;
    const cleanWords = this.text.toLowerCase().match(/[a-z0-9]+/g);
    return cleanWords;
  }

  /**
   * validateFile method ensures all the documents in a file are valid i.e.
   * they should be arrays of objects that have only title and text keys
   * and Strings as value
   * @param {Object} fileContent - the uploaded contents of the file
   * @return {Boolean} true or false if the method was successful or not
  */
  validateFile(fileContent) {
    this.fileContent = fileContent;
    if (Array.isArray(this.fileContent)) {
      for (let item = 0; item < this.fileContent.length; item += 1) {
        if ((typeof this.fileContent[item]) !== 'object') {
          return false;
        }
        if (Object.keys(this.fileContent[item]).length !== 2 ||
            Object.keys(this.fileContent[item])[0] !== 'title' ||
            Object.keys(this.fileContent[item])[1] !== 'text') {
          return false;
        }
        if ((typeof this.fileContent[item].title) !== 'string' ||
            (typeof this.fileContent[item].text) !== 'string') {
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
  readFile(rawFile) {
    this.rawFile = rawFile;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = data => resolve(data.target.result);
      reader.onerror = error => reject(`Error reading + ${this.rawFile.name}: ${error.target.result}`);
      reader.readAsText(this.rawFile);
    });
  }

  /**
   * searchIndex method searches the indexed files for occurences of words
   * @param {String} word - word(s) that one is searching for
   * @param {String} fileName - specific file or all to search through
   * @return {Object} Object with indexes of word(s) in the file(s)
   *                  and other file properties
  */
  searchIndex(word, fileName) {
    const found = [];
    const cleanedTerms = this.tokenize(word);

    if (cleanedTerms === null) {
      return false;
    }

    if (fileName === 'All') {
      const allFiles = Object.keys(this.allIndexed);
      allFiles.forEach((file) => {
        const result = {};
        cleanedTerms.forEach((term) => {
          result[term] = this.allIndexed[file][term];
        });
        found.push({
          indexes: result,
          wordsSearchedFor: cleanedTerms.toString(),
          documentIndexes: this.documentsIndex[file],
          searchedFile: file,
          title: this.allTitles[file],
        });
      });
      return found;
    }
    const result = {};
    cleanedTerms.forEach((term) => {
      result[term] = this.allIndexed[fileName][term];
    });
    found.push({
      indexes: result,
      wordsSearchedFor: cleanedTerms.toString(),
      documentIndexes: this.documentsIndex[fileName],
      searchedFile: fileName,
      title: this.allTitles[fileName],
    });
    return found;
  }
}

