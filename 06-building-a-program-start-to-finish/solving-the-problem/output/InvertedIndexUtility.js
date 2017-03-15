/* eslint-disable no-unsed-vars */
/* eslint-disable no-undef */

/**
 * Utility class for InvertedIndex class
 * @class InvertedIndexUtility
 */
class InvertedIndexUtility {
/**
 * Checks input to see if it conforms to specific standards
 * @param {Array} file - Book file to be validated
 * @returns {Boolean} true/false - returns validation status
 * @memberOf InvertedIndex
 */
  static validateInput(file) {
    if (Array.isArray(file) && file.length > 0) {
      const books = Object.keys(file);
      for (let i = 0; i < books.length;) {
        if (file[i].text && file[i].title) {
          i += 1;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }

/**
* Removes characters, whitespaces and converts text to array elements
* @param {String} text returned from getBookAsText
* @returns {Array} -returns words in lower-cases with no characters
* @memberOf InvertedIndexUtility
*/
  static generateToken(text) {
    return text.toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .split(/\s+/);
  }

/**
 * Gets an array of words and makes elements have unique occurrences
 * @param {Array} words - a book object with title and text property
 * @returns {Array} words - a filtered array with unique elements
 * @memberOf InvertedIndexUtility
 */
  static createUniqueWords(words) {
    return words.filter((element, index) =>
        words.indexOf(element) === index);
  }
}

