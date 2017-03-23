/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * @class InvertedIndexUtility
 */
class InvertedIndexUtility {
/**
   * filterIndexed method takes an already indexed array
   * and filters it to match the query
   * @param {Array} searchTerms - An array of the words
   * gotten from the sanitized query
   * @param {Array} indexedFile - An already indexed file
   * @return {Array} - The queried indexed array
   * @memberOf InvertedIndexUtility
   */
  static filterIndexed(searchTerms, indexedFile) {
    const result = [];
    searchTerms.forEach((term) => {
      indexedFile.forEach((index) => {
        if (term === index[0]) {
          result.push(index);
        }
      });
    });
    return result;
  }

  /**
   * This method remove all the duplicate words in an Array
   * @param {Array} words - an array of words
   * @returns {Array} - a new array with no duplicate words
   */
  static removeDuplicateWords(words) {
    const uniqueWords = [];
    let index = 0;
    words.forEach((word) => {
      if (words.lastIndexOf(word) === index) {
        uniqueWords.push(word);
      }
      index += 1;
    });
    return uniqueWords;
  }

   /**
   * This methods gets all the tokens in a text
   * @param {String} text - A text of words
   * @returns {Array} - An array consisting of all the tokens in the text
   */
  static tokenize(text) {
    return text.trim().replace(/-/g, ' ')
    .replace(/[^A-z\s]/g, '')
    .toLowerCase()
    .split(' ');
  }

  /**
   * @static
   * @param {Array} words - An array of all the words in the text of the book
   * @param {Array} wordsInEachBook - An Array of all the words in each book
   * @param {Array} bookTitles - An array that consist of a sub array
   * of all the words in each book
   * @returns {Array} - An array consisiting of a sub array with each word
   * and booleans to indicate their occurence in each book
   * @memberOf InvertedIndexUtility
   */
  static constructIndex(words, wordsInEachBook, bookTitles) {
    const checked = this.checkOccurence(words, wordsInEachBook);
    const booksLength = bookTitles.length;
    const booksChecked = this.getEachBookOccurence(checked, booksLength);
    const indexConstructed = this.mapWordsWithOccurence(words, booksChecked);
    return indexConstructed;
  }

  /**
   * This method gets the title of each book in a file
   * @static
   * @param {Array} file - The content of the given file
   * @returns {Array} - The Title of each book in the file
   * @memberOf InvertedIndexUtility
   */
  static getTitlesOfEachBook(file) {
    const titleList = [];
    file.forEach(book => titleList.push(book.title));
    return titleList;
  }

  /**
   * @param {Array} file - contains an array of objects that
   * contain each book with their title and text.
   * @returns {Array} - an Array that contains all the words in
   * the book without duplication
   */
  static getAllWords(file) {
    let words = '';

    file.map(book => (words += `${book.text} `));
    words = this.tokenize(words).slice(0, words.length - 1);
    words = this.removeDuplicateWords(words);

    return words.slice(0, words.length);
  }

  /**
   * This function returns an array that consists of all the words in each book
   * [[], [], ]
   * @static
   * @param {Array} file - contains an array of objects that
   * contain each book with their title and text.
   * @returns {Array} - an array that consist of all the words in each book
   * @memberOf InvertedIndexUtility
   */
  static getAllWordsInEachBook(file) {
    const doc = [];
    let bookContent;
    file.forEach((book) => {
      bookContent = `${book.text} `;
      bookContent = this.tokenize(bookContent);
      bookContent = this.removeDuplicateWords(bookContent);
      doc.push(bookContent.slice(0, bookContent.length));
    });
    return doc;
  }

  /**
   * This function takes two arrays and checks
   * if each of the words in the first array is present in the second array
   * @static
   * @param {Array} words - contains all the words
   * in the book without duplication
   * @param {Array} wordsInEachBook - contains all the  words
   * in a given document
   * @returns {Array} - An array that consist of
   * booleans to indicate if the words are present in each book
   * e.g [true, false, false, false, false, true . . .]
   * @memberOf InvertedIndexUtility
   */
  static checkOccurence(words, wordsInEachBook) {
    const checked = [];

    words.forEach((word) => {
      wordsInEachBook.forEach((eachWord) => {
        if (eachWord.indexOf(word) === -1) {
          checked.push(false);
        } else {
          checked.push(true);
        }
      });
    });
    return checked;
  }

  /**
   * This methods returns an array that consists of
   * sub arrays of the word and booleans that indicate
   *  if the word is present in the book
   * e.g [[true, false, false], [false, false, true], [true, true, true]]
   * @static
   * @param {Array} checked - This array consist of
   * booleans to indicate if the words are present in each book
   * e.g [true, false, false, false, false, true . . .]
   * @param {Integer} bookCount - The number of the book present in the file
   * @returns {Array} - An Array that consist of sub arrays of each word
   * and a boolean to indicate their presence in each book
   * @memberOf InvertedIndexUtility
   */
  static getEachBookOccurence(checked, bookCount) {
    const result = [];
    let subResult = [];
    let index = 0;
    checked.forEach((check) => {
      if (index < bookCount) {
        subResult.push(check);
      }
      index += 1;
      if (index === bookCount) {
        result.push(subResult);
        index = 0;
        subResult = [];
      }
    });
    return result;
  }

  /**
   * This method returns an array that consists of sub array that consist of a
   *  word and a boolean that indicates it's presence in each book
   * e.g [['Alice', true, false, false], ['in', false, false, true], ... ]
   * @param {Array} words - An array of all words in a given book text
   * @param {Array} wordsOccurrence  An Array that consist of sub arrays of
   * each word and a boolean to indicate their presence in each book
   * @returns {Array} - The array consist of a sub array of each word present
   * in each book and a boolean to indicate their presence in each boom
   * @memberOf InvertedIndexUtility
   */
  static mapWordsWithOccurence(words, wordsOccurrence) {
    let index = 0;
    words.forEach((word) => {
      wordsOccurrence[index].unshift(word);
      index += 1;
    });
    return wordsOccurrence;
  }

  /**
   * This method returns the index of a fileName if present in a given Array.
   * The method returns -1 if it isn't present in the given Array.
   * @static
   * @param {Array} fileNames
   * @param {String} fileName
   * @returns {Integer} - The index of the fileName
   * @memberOf InvertedIndexUtility
   */
  static getSelectedIndex(fileNames, fileName) {
    return fileNames.indexOf(fileName);
  }

  /**
   * This method checks if the file is valid JSON
   * @param {JSON} file
   * @returns {boolean} - return true or false depending
   * on whether the file is valid JSON
   * @memberOf Validations
   */
  static isValidJson(file) {
    try {
      JSON.parse(file);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * This method checks if the content of a JSON file is valid
   * @param {JSON} file - The content of the JSON file
   * @returns {boolean} - returns true or false depending
   * on whether the content of the JSON file is valid
   * @memberOf InvertedIndex
   */
  static isValidContent(file) {
    let isValid = true;
    if (file.length === 0) {
      return false;
    }
    file.forEach((book) => {
      if ((!book.title) || (!book.text)) {
        isValid = false;
      }
    });
    return isValid;
  }
}
