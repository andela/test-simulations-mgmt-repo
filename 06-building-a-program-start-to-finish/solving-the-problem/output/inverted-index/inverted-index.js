'use strict';

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
  }

  /**
   * Reads the data from the file being uploaded as a JavaScript object
   * @param {Object} book - object of book containing documents
   * @return {Object} if true
   * @return {Boolean.<false>} if false
   */
  readFile(book) {
    try {
      return JSON.parse(book);
    } catch (error) {
      return false;
    }
  }

  /**
   * Ensures all the documents in a particular file is valid
   * @param {array} allBooks - Array containing document objects of bookname
   * @param {string} bookname - Name of the book to validate
   * @return {Promise.<bookHolder>} An Object containing validated book
   */
  validateFile(allBooks, bookname) {
    return new Promise((resolve, reject) => {
      if (Object.keys(allBooks).length < 1) {
        reject('Cannot index an empty object');
      } else {
        bookname = bookname.split('.')[0];
        const bookHolder = { [bookname]: {} };
        allBooks.map((eachBook, eachIndex) => {
          if (Object.prototype.hasOwnProperty.call(eachBook, 'title')
            && Object.prototype.hasOwnProperty.call(eachBook, 'text')) {
            if ((eachBook.title).length < 1 || (eachBook.text).length < 1) {
              reject(`Document ${parseInt(eachIndex, 10) + 1} have an empty title or text.`);
            }
            bookHolder[bookname][eachIndex] = {
              title: eachBook.title.toLowerCase(),
              text: eachBook.text.toLowerCase(),
            };
          } else {
            reject(`Document ${parseInt(eachIndex, 10) + 1} in ${bookname}.json book do not have a "title" or "text" fields`);
          }
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
  tokenize(text) {
    let sanitizedText = text.replace(/[^\w\s]+/gi, '');
    sanitizedText = sanitizedText.replace(/\s\s+/g, ' ');
    sanitizedText = sanitizedText.replace(/^[.\s]+|[.\s]+$/g, '');
    return sanitizedText.toLowerCase();
  }

  /**
   * Creates a word array for each document in a book
   * @param {Object} book - documents in a book
   * @return {Array.<Object>} bookContents - words in each document
   */
  createsArray(book) {
    const bookContents = [];
    Object.keys(book).map((documentPosition) => {
      const mergedTitleAndText = `${book[documentPosition].title} ${book[documentPosition].text}`;
      bookContents.push(this.tokenize(mergedTitleAndText).split(' '));
    });
    return bookContents;
  }

  /**
   * Creates the index for specified book
   * @param {string} bookname - Name of book to be indexed
   * @param {object} book - document words in specified book
   * @return {Promise.<iDexMapper>} - indexes of specified book
   */
  createIndex(bookname, book) {
    const tokenIndex = {};
    this.numberOfDocuments[bookname] = [];
    const bookContents = this.createsArray(book);
    return new Promise((resolve) => {
      bookContents.map((eachdocument, documentPosition) => {
        const documentPositionToInt = parseInt(documentPosition, 10);
        this.numberOfDocuments[bookname].push(documentPositionToInt);
        eachdocument.map((eachWord) => {
          if (tokenIndex[eachWord]) {
            if (tokenIndex[eachWord].indexOf(documentPositionToInt) === -1) {
              tokenIndex[eachWord].push(documentPositionToInt);
            }
          } else {
            tokenIndex[eachWord] = [documentPositionToInt];
          }
        });
      });
      this.iDexMapper[bookname] = tokenIndex;
      resolve(this.iDexMapper[bookname]);
    });
  }

  /**
   * Get’s indexes created for particular files
   * @param {String} bookname - name of book to get its indexes
   * @return {Object.<iDexMapper>} - indexes of specified bookname
   */
  getIndex(bookname) {
    return this.iDexMapper[bookname];
  }

/**
 * Searches through one or more indices for words
 * @param {String} bookname - name of book to search
 * @param {String} tokens - words to search
 * @return {Object.<searchResult>} - words in each book specified
 */
  searchIndex(bookname, tokens) {
    tokens = tokens.split(' ');
    const allBooks = this.iDexMapper;
    const bookToSearchName = bookname;
    const searchResult = [];
    if (bookToSearchName === 'allBooks') {
      Object.keys(allBooks).map((book) => {
        const search = this.getSearchResult(book, tokens);
        searchResult.push(search);
      });
    } else {
      const search = this.getSearchResult(bookToSearchName, tokens);
      searchResult.push(search);
    }
    return searchResult;
  }

  /**
   * Get search result for the specified book
   * @param {String} bookname - name of book to search
   * @param {String} tokens - words to search
   * @return {Object<searchResult>} - words in specified books
   */
  getSearchResult(bookname, tokens) {
    const allBooks = this.iDexMapper;
    if (!(allBooks[bookname])) {
      return false;
    }
    const searchResult = {};
    searchResult[bookname] = {};
    tokens.map((word) => {
      searchResult[bookname][word] = allBooks[bookname][word] || [];
    });
    return searchResult;
  }
};

module.exports.InvertedIndex = InvertedIndex;
