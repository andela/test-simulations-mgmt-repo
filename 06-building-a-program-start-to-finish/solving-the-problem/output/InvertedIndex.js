/**
 * Class representing InvertedIndex
 */
const InvertedIndex = class {

  /**
   * InvertedIndex Constructor
   * @constructor
   */
  constructor() {
    this.iDexMapper = {};
    this.numberOfDocuments = {};
    this.unIndexedBooks = {};
    this.indexedBookTitles = {};
  }

  /**
   * Reads the data from the file being uploaded as a JavaScript object
   * @param {Object} book - object of book containing documents
   * @return {Object} if true
   * @return {Boolean.<false>} if false
   */
  static readFile(book) {
    try {
      return JSON.parse(book);
    } catch (error) {
      return false;
    }
  }

  /**
   * Ensures all the documents in a particular file is valid
   * @param {array} allBooks - Array containing document objects of bookName
   * @param {string} bookName - Name of the book to validate
   * @return {Promise.<bookHolder>} An Object containing validated book
   */
  static validateFile(allBooks, bookName) {
    return new Promise((resolve, reject) => {
      if (Object.keys(allBooks).length < 1) {
        reject('Cannot index an empty object');
      } else {
        bookName = bookName.split('.')[0];
        const bookHolder = { [bookName]: {} };
        allBooks.map((eachBook, eachIndex) => {
          if (Object.prototype.hasOwnProperty.call(eachBook, 'title')
            && Object.prototype.hasOwnProperty.call(eachBook, 'text')) {
            if ((eachBook.title).length < 1 || (eachBook.text).length < 1) {
              const index = parseInt(eachIndex, 10) + 1;
              reject(`Document ${index} have an empty title or text.`);
            }
            bookHolder[bookName][eachIndex] = {
              title: eachBook.title.toLowerCase(),
              text: eachBook.text.toLowerCase(),
            };
          } else {
            const index = parseInt(eachIndex, 10) + 1;
            reject(`No 'title' or 'text' in Document ${index} of ${bookName}`);
          }
          return this;
        });
        resolve(bookHolder);
      }
    });
  }

   /**
   * Strips out special characters from documents to be indexed
   * @param {String} text - contents of each document
   * @return {String} sanitizedText - sanitized contents of each document
   */
  static tokenize(text) {
    return text.replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /**
   * Creates a word array for each document in a book
   * @param {String} bookName - name of a book to index
   * @param {Object} book - documents in a book
   * @return {Array.<Object>} bookContents - words in each document
   */
  createsArray(bookName, book) {
    const bookContents = [];
    Object.keys(book).map((documentPosition) => {
      const mergedTitleAndText = `${book[documentPosition].title} 
      ${book[documentPosition].text}`;
      bookContents.push(InvertedIndex.tokenize(mergedTitleAndText).split(' '));
      this.setBookTitles(bookName, book[documentPosition].title);
      return this;
    });
    return bookContents;
  }

  /**
   * Sets title(s) for a book in an instance variable - indexedBookTitles
   * @param {String} bookName - name of a book being indexed
   * @param {String} title - a titlee in the book being indexed
   * @returns {Void} indexedBookTitles - instance variable
   */
  setBookTitles(bookName, title) {
    if (this.indexedBookTitles[bookName]) {
      this.indexedBookTitles[bookName].push(title);
    } else {
      this.indexedBookTitles[bookName] = [];
      this.indexedBookTitles[bookName].push(title);
    }
  }

  /**
   * Creates the index for specified book
   * @param {string} bookName - Name of book to be indexed
   * @param {object} book - document words in specified book
   * @return {Promise.<iDexMapper>} - indexes of specified book
   */
  createIndex(bookName, book) {
    const tokenIndex = {};
    this.numberOfDocuments[bookName] = [];
    const bookContents = this.createsArray(bookName, book);
    return new Promise((resolve) => {
      bookContents.map((eachdocument, documentPosition) => {
        const documentPositionToInt = parseInt(documentPosition, 10);
        this.numberOfDocuments[bookName].push(documentPositionToInt);
        return eachdocument.map((eachWord) => {
          if (tokenIndex[eachWord]) {
            if (tokenIndex[eachWord].indexOf(documentPositionToInt) === -1) {
              tokenIndex[eachWord].push(documentPositionToInt);
            }
          } else {
            tokenIndex[eachWord] = [documentPositionToInt];
          }
          return this;
        });
      });
      this.iDexMapper[bookName] = tokenIndex;
      resolve(this.iDexMapper[bookName]);
    });
  }

  /**
   * Get’s indexes created for particular files
   * @param {String} bookName - name of book to get its indexes
   * @return {Object.<iDexMapper>} - indexes of specified bookName
   */
  getIndex(bookName) {
    return this.iDexMapper[bookName];
  }

/**
 * Searches through one or more indices for words
 * @param {String} bookName - name of book to search
 * @param {String} tokens - words to search
 * @return {Object.<searchResult>} - words in each book specified
 */
  searchIndex(bookName, tokens) {
    tokens = tokens.split(' ');
    const allBooks = this.iDexMapper;
    const bookToSearchName = bookName;
    const searchResult = [];
    if (bookToSearchName === 'allBooks') {
      Object.keys(allBooks).map((book) => {
        const search = this.getSearchResult(book, tokens);
        searchResult.push(search);
        return searchResult;
      });
    } else {
      const search = this.getSearchResult(bookToSearchName, tokens);
      searchResult.push(search);
    }
    return searchResult;
  }

  /**
   * Get search result for the specified book
   * @param {String} bookName - name of book to search
   * @param {String} tokens - words to search
   * @return {Object<searchResult>} - words in specified books
   */
  getSearchResult(bookName, tokens) {
    const allBooks = this.iDexMapper;
    if (!(allBooks[bookName])) {
      return false;
    }
    const searchResult = {};
    searchResult[bookName] = {};
    tokens.map((word) => {
      searchResult[bookName][word] = allBooks[bookName][word] || [];
      return searchResult;
    });
    return searchResult;
  }
};

module.exports.InvertedIndex = InvertedIndex;
