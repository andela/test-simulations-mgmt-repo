/**
 * InvertedIndex class
 * @class
 */
class InvertedIndex {
  /**
   * class constructor
   * @constructor
   * @param {Array} filenames names of files to initialize the index with
   * @param {Object} files file index(es) to be stored initially
   */
  constructor(filenames = [], files = {}) {
    this.filenames = filenames;
    this.files = files;
  }

  /**
   * Validates file content
   * @function
   * @param {Array} fileContent content of uploaded file
   * @return {Boolean} true if a valid file was uploaded, false otherwise
   */
  static validateFile(fileContent) {
    if ((fileContent instanceof Array) && fileContent.length > 0) {
      const BreakError = {
        name: 'Validate File Error',
        message: 'File is invalid'
      };
      try {
        fileContent.forEach((book) => {
          if (!(book.title && book.text) || book.text.length < 1) {
            throw BreakError;
          }
          if (book.text.length < 1) throw BreakError;
        });
      } catch (error) {
        if (error.name === 'Validate File Error') return false;
        throw error;
      }
      return true;
    }
    return false;
  }

  /**
   * Strips out special characters and numbers, also removes duplicate words
   * @function
   * @param {String} text text from the book
   * @return {Array} An array of unique words in the text
   */
  static tokenize(text) {
    return text.replace(/[^A-Za-z\s-]/g, '')
      .toLowerCase().split(/\s+/)
      .filter((word, index, collection) => collection.indexOf(word) === index);
  }

  /**
   * Creates an index object from the file content and stores it
   * @function
   * @param {Array} fileContent content of uploaded file
   * @param {String} filename name of uploaded file
   * @return {Boolean} true if file index was successfully created, else false
   */
  createIndex(fileContent, filename) {
    if (this.filenames.indexOf(filename) !== -1) return false;

    const result = { bookTitles: [], words: {}, allWords: [], filename };
    fileContent.forEach((book, bookIndex) => {
      result.bookTitles.push(book.title);
      const words = InvertedIndex.tokenize(book.text);

      words.forEach((word) => {
        if (!result.words[word]) {
          result.allWords.push(word);
          result.words[word] = new Array(fileContent.length).fill(false);
        }
        result.words[word][bookIndex] = true;
      });
    });

    this.filenames.push(filename);
    this.files[filename] = result;
    return true;
  }

  /**
   * Returns stored index for a file given the filename
   * @function
   * @param {String} filename name of the file
   * @return {Object|Boolean} indexed object or false if file was not found
   */
  getIndex(filename) {
    if (!this.files[filename]) return false;
    return this.files[filename];
  }

  /**
   * Searches the index
   * @function
   * @param {String} searchKey string containing word(s) to be searched for
   * @param {Object} filename (optional) name of an indexed file where
   * the search will be performed
   * @return {Object|Boolean} search result or false if nothing was found
   */
  searchIndex(searchKey, filename = false) {
    if (typeof searchKey !== 'string' || searchKey === '') return false;
    const searchTerms = InvertedIndex.tokenize(searchKey);
    const searchResult = { filenames: [] };

    const collection = (filename) ? [filename] : this.filenames;
    collection.forEach((file) => {
      const result = { words: {}, allWords: [] };
      searchTerms.forEach((word) => {
        if (this.files[file].words[word]) {
          result.allWords.push(word);
          result.words[word] = this.files[file].words[word];
        }
      });
      if (result.allWords.length > 0) {
        searchResult.filenames.push(file);
        searchResult[file] = result;
      }
    });

    if (searchResult.filenames.length < 1) return false;
    return searchResult;
  }

  /**
   * Deletes the index of a file
   * @function
   * @param {String} filename name of file to be deleted
   * @return {Boolean} true if file was successfully deleted, else false
   */
  deleteFileIndex(filename) {
    if (!this.files[filename]) return false;

    this.files[filename] = undefined;
    this.filenames.splice(this.filenames.indexOf(filename), 1);
    return true;
  }
}
