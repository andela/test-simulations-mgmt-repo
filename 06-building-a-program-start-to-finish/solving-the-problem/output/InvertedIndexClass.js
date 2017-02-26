/**
 *
 *
 * @class InvertedIndex
 */
class InvertedIndex {
/**
* Creates an instance of InvertedIndex.
* @memberOf InvertedIndex
*/
  constructor() {
    this.mainIndex = {};
    this.bookNames = [];
  }

/**
 * Checks input to see if it comforms to specific standards.
 * @param {Array} book - Book file to be validated
 * @returns {boolean} true/false - returns validation status.
 * @memberOf InvertedIndex
 */
  validateInput(book) {
    if (Array.isArray(book) && book.length > 0 && typeof book[0] === 'object') {
      if (book[0].text && book[0].title) {
        if (typeof (book[0].text) === 'number') {
          return false;
        }
        return true;
      }
    }
    return false;
  }


/**
 * Gets a book and returns it as as a concatenated text
 * @param {Object} book - a book object with title and text property
 * @returns {String} text- returns boolean if conditions are not met
 * @memberOf InvertedIndex
 */
  getBookAsText(book) {
    const status = this.validateInput([book]);
    if (status) {
      this.bookNames.push(book.title);
      return `${book.title} ${book.text}`;
    }
    return status;
  }

/**
* Removes characters, whitespaces and converts text to array elements.
* @param {String} text returned from getBookAsText
* @returns {Array} -returns an array of words in lower-cases with no characters
* @memberOf InvertedIndex
*/
  generateToken(text) {
    return text.toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .split(/\s+/);
  }


/**
 * Gets an array of Words and makes element have unique occurences
 * @param {Object} arrayOfWords - an  book object with title and text property
 * @returns {Array} arrayOfWords - a filtered array with unique elements
 * @memberOf InvertedIndex
 */
  returnUniqueWords(arrayOfWords) {
    return arrayOfWords.filter((element, index) =>
        arrayOfWords.indexOf(element) === index);
  }


/**
 * Builds an index for a Book Objects
 * @param {Array} books - An Array of book objects
 * @returns {String} Build status as a feedback message
 * @memberOf InvertedIndex
 */
  buildIndex(books) {
    let nonUniqueWords = '';
    let words = '';
    books.forEach((book) => {
      nonUniqueWords = this.generateToken(this.getBookAsText(book));
      words = this.returnUniqueWords(nonUniqueWords);
      words.forEach((word) => {
        this.addWordToMainIndex(word, book.title);
      });
    });
    return 'Index Built';
  }


/**
 * Takes a word and a book title and stores it in tne mainindex
 * @param {any} word
 * @param {any} bookTitle
 * @returns {none} ...
 * @memberOf InvertedIndex
 */
  addWordToMainIndex(word, bookTitle) {
    if (this.mainIndex[word]) {
      this.mainIndex[word].push(bookTitle);
    } else {
      this.mainIndex[word] = [bookTitle];
    }
  }

/**
 *
 * Takes in word(s) and returns found results based on created index
 * @param {String} searchedWords - Word(s) used to initiate a search
 * @returns {Array} searchResult - An array of matched books
 * @memberOf InvertedIndex
*/
  searchIndex(searchedWords) {
    let searchResult = [];
    let output = '';
    const wordsToSearch = this.returnUniqueWords(this
       .generateToken(searchedWords));
    wordsToSearch.forEach((searchedWord) => {
      const indexedWords = Object.keys(this.mainIndex);
      indexedWords.forEach((indexedWord) => {
        if (searchedWord === indexedWord) {
          output = this.mainIndex[indexedWord];
          searchResult = output;
        }
      });
    });
    return searchResult;
  }
}
