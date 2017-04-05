/**
 * The Inverted Index class
 */
class InvertedIndex {

  /**
   * Constructor initializes indexes as an empty object
   * and keeps track of the files that have been indexed
   * @constructor
   */
  constructor() {
    this.allIndexed = {};
  }

  /**
   * Create Index
   * createIndex method takes a single document and builds an index from it
   * @param {Object} file - the file to be indexed
   * @param {String} filename - the name of the file to be indexed
   * @return {Object} all words in the file and their corresponding indexes
   */
  createIndex(file, filename) {
    const indexed = {};
    file.forEach((obj, index) => {
      let text = `${obj.title} ${obj.text}`;
      text = this.tokenize(text);
      text.forEach((word) => {
        if (!(word in indexed)) {
          indexed[word] = [(index)];
        } else if (!(indexed[word].includes(index))) {
          indexed[word].push(index);
        }
      });
    });
    this.allIndexed[filename] = indexed;
    return indexed;
  }

  /**
   * Get Index
   * getIndex method gets the indexed file with words from documents that were
   * found. If the file has not been indexed, it calls the create index method
   * @param {Object} file - the file we want to get indexed
   * @param {String} filename - the name of the file to be indexed
   * @return {Object} all words in the file and their corresponding indexes
   */
  getIndex(file, filename) {
    if (filename in this.allIndexed) {
      return this.allIndexed[filename];
    }
    return this.createIndex(file, filename);
  }

   /**
   * tokenize method removes special characters and returns an array of words
   * @param {string} text - the validated text to be tokenized
   * @return {array} array of words in the document
  */
  tokenize(text) {
    this.text = text;
    let cleanWords = text.replace(/[^\w\s]/gi, ' ').replace(/_/g, ' ');
    cleanWords = cleanWords.replace(/\s+/g, ' ').toLowerCase();
    cleanWords = cleanWords.trim();
    return cleanWords.split(' ');
  }

  /**
   * validateFile method ensures all the documents in a file are valid i.e.
   * they should be arrays of objects that have only title and text keys
   * and Strings as value
   * @param {Object} file - the uploaded and read file
   * @return {Bool} true or false if the method was successful or not
  */
  validateFile(file) {
    this.file = file;
    if (Array.isArray(this.file)) {
      for (let item = 0; item < this.file.length; item += 1) {
        if ((typeof this.file[item]) !== 'object') {
          return false;
        }
        if (Object.keys(this.file[item]).length !== 2 ||
            Object.keys(this.file[item])[0] !== 'title' ||
            Object.keys(this.file[item])[1] !== 'text') {
          return false;
        }
        if ((typeof this.file[item].title) !== 'string' ||
            (typeof this.file[item].text) !== 'string') {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * readFile method reads the data from the file being uploaded
   * @param {JSON} fileData - the raw uploaded file
   * @return {String} string of text in the uploaded file
  */
  readFile(fileData) {
    this.fileData = fileData;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(`Error reading + ${this.fileData.name}: ${e.target.result}`);
      reader.readAsText(this.fileData);
    });
  }

  /**
   * searchIndex method searches the indexed files for occurences of words
   * @param {String} word - word that one is searching for
   * @param {String} filename - specific file to search through
   * @return {array} array of indexes of word(s) in the file(s)
  */
  searchIndex(word, filename) {
    if (this.allIndexed[filename][word] === undefined) {
      return false;
    }
    return this.allIndexed[filename][word];
  }
}

