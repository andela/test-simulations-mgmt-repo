/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * @class InvertedIndexUtility
 */
class InvertedIndexUtility {
/**
   * filterIndexed method takes an already indexed array
   * and filters it to match the query
   * @param {Array} query - An array of the words
   * gotten from the sanitized query
   * @param {Array} indexedFile - An already indexed file
   * @return {Array} - The queried indexed array
   * @memberOf InvertedIndexUtility
   */
  static filterIndexed(query, indexedFile) {
    const result = [];
    query.forEach((term) => {
      indexedFile.forEach((index) => {
        if (term === index[0]) {
          result.push(index);
        }
      });
    });
    return result;
  }

  /**
   * sanitizeQuery method removes unwanted terms in the query string
   * and also converts the query string into an array of each unique term
   * @static
   * @param {String} query - The terms to search for the index
   * @returns {Array} - The already formatted query
   * @memberOf InvertedIndexUtility
   */
  static sanitizeQuery(query) {
    query = query.toLowerCase()
    .replace(/-/g, ' ')
    .replace(/[^A-z\s]/g, '')
    .split(' ');
    let result = [];
    query.forEach((word) => {
      if (word.trim() !== '') {
        result.push(word);
      }
    });
    result = this.removeDuplicateWords(result);
    return result;
  }

  /**
   * This method remove all the duplicate words in an Array
   * @param {*} words - an array of words
   * @returns {Array} - a new array with no duplicate words
   */
  static removeDuplicateWords(words) {
    const uniqueWords = [];
    for (let i = 0; i < words.length; i += 1) {
      if (words.lastIndexOf(words[i]) === i) {
        uniqueWords.push(words[i]);
      }
    }
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
    const checked = this
    .checkOccurenceOfWords(words, wordsInEachBook);
    const booksLength = bookTitles.length;
    const booksChecked = this
    .getWordOccurenceForEachBook(checked, booksLength);
    const indexConstructed = this
    .mapWordsWithOccurence(words, booksChecked);
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
    for (let i = 0; i < file.length; i += 1) {
      titleList.push(file[i].title);
    }
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
    for (let i = 0; i < file.length; i += 1) {
      words += `${file[i].text} `;
    }
    words = this.Tokenize(words).slice(0, words.length - 1);
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
    for (let i = 0; i < file.length; i += 1) {
      bookContent = `${file[i].text} `;
      bookContent = this.Tokenize(bookContent);
      bookContent = this.removeDuplicateWords(bookContent);
      doc.push(bookContent.slice(0, bookContent.length));
    }
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
  static checkOccurenceOfWords(words, wordsInEachBook) {
    const checked = [];

    words.forEach((word) => {
      for (let i = 0; i < wordsInEachBook.length; i += 1) {
        if (wordsInEachBook[i].indexOf(word) === -1) {
          checked.push(false);
        } else {
          checked.push(true);
        }
      }
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
  static getWordOccurenceForEachBook(checked, bookCount) {
    const result = [];
    const stopIndex = Math.ceil(checked.length / bookCount);

    for (let i = 0; i <= stopIndex; i += 1) {
      const startRange = i * bookCount;
      const endRange = (i + 1) * bookCount;

      if (endRange <= checked.length) {
        result.push(checked.slice(startRange, endRange));
      }
    }
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
    for (let i = 0; i < words.length; i += 1) {
      wordsOccurrence[i].unshift(words[i]);
    }
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
   * @param {any} file
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
   * @param {any} file - The content of the JSON file
   * @returns {boolean} - returns true or false depending
   * on whether the content of the JSON file is valid
   * @memberOf InvertedIndex
   */
  static isValidContent(file) {
    if (file.length === 0) {
      return false;
    }

    for (let i = 0; i < file.length; i += 1) {
      if ((!file[i].title) || (!file[i].text)) {
        return false;
      }
    }
    return true;
  }
}
