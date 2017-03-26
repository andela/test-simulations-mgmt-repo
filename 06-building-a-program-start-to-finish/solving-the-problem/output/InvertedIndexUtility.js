/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * @class InvertedIndexUtility
 */
class InvertedIndexUtility {
  /**
   * filterIndexed method takes an already indexed array
   * and filters it to match the search terms
   * @param {Array} tokens - An array of the words
   * gotten from the tokenize function
   * @param {Array} indices - An already indexed file
   * @return {Array} - The filtered indexed array
   * @memberOf InvertedIndexUtility
   */
  static filterIndexed(tokens, indices) {
    const result = [];
    tokens.forEach((token) => {
      indices.forEach((index) => {
        if (token === index[0]) {
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
  static removeDuplicates(words) {
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
   * @param {Array} books - An Array of all the words in each book
   * @param {Array} titles - An array that consist of all the titles of each
   * book in a file
   * @returns {Array} - An array consisiting of a sub array with each word
   * and booleans to indicate their occurence in each book
   * @memberOf InvertedIndexUtility
   */
  static constructIndex(words, books, titles) {
    const checked = this.checkOccurrence(words, books);
    const booksLength = titles.length;
    const booksChecked = this.getBookOccurrence(checked, booksLength);
    const indexConstructed = this.mapWords(words, booksChecked);
    return indexConstructed;
  }

  /**
   * This method gets the title of each book in a file
   * @static
   * @param {Array} file - The content of the given file
   * @returns {Array} - The Title of each book in the file
   * @memberOf InvertedIndexUtility
   */
  static getBookTitles(file) {
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
    words = this.removeDuplicates(words);

    return words.slice(0, words.length);
  }

  /**
   * This function returns an array that consists of all the words in each book
   * @static
   * @param {Array} file - contains an array of objects that
   * contain each book with their title and text.
   * @returns {Array} - an array that consist of all the words in each book
   * @memberOf InvertedIndexUtility
   */
  static getBookWords(file) {
    const words = [];
    let bookContent;
    file.forEach((book) => {
      bookContent = `${book.text} `;
      bookContent = this.tokenize(bookContent);
      bookContent = this.removeDuplicates(bookContent);
      words.push(bookContent.slice(0, bookContent.length));
    });
    return words;
  }

  /**
   * This function takes two arrays and checks
   * if each of the words in the first array is present in the second array
   * @static
   * @param {Array} words - contains all the words
   * in the book without duplication
   * @param {Array} books - contains all the  words
   * in each book in a given document
   * @returns {Array} - An array that consist of
   * booleans to indicate if the words are present in each book
   * e.g [true, false, false, false, false, true . . .]
   * @memberOf InvertedIndexUtility occurrence
   */
  static checkOccurrence(words, books) {
    const checked = [];

    words.forEach((word) => {
      books.forEach((bookWord) => {
        if (bookWord.indexOf(word) === -1) {
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
   * @param {Array} list - This array consist of
   * booleans to indicate if the words are present in each book
   * e.g [true, false, false, false, false, true . . .]
   * @param {Integer} count - The number of the book present in the file
   * @returns {Array} - An Array that consist of sub arrays of each word
   * and a boolean to indicate their presence in each book
   * @memberOf InvertedIndexUtility
   */
  static getBookOccurrence(list, count) {
    const result = [];
    let subResult = [];
    let index = 0;
    list.forEach((item) => {
      if (index < count) {
        subResult.push(item);
        index += 1;
      }

      if (index === count) {
        result.push(subResult);
        index = 0;
        subResult = [];
      }
    });
    return result;
  }

  /**
   * This method map words with occurrence.
   * It returns an array that consists of sub array that consist of a
   * word and a boolean that indicates it's presence in each book
   * e.g [['Alice', true, false, false], ['in', false, false, true], ... ]
   * @param {Array} words - An array of all words in a given book text
   * @param {Array} list -  An Array that consist of sub arrays of
   * each word and a boolean to indicate their presence in each book
   * @returns {Array} - The array consist of a sub array of each word present
   * in each book and a boolean to indicate their presence in each boom
   * @memberOf InvertedIndexUtility
   */
  static mapWords(words, list) {
    let index = 0;
    words.forEach((word) => {
      list[index].unshift(word);
      index += 1;
    });
    return list;
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
