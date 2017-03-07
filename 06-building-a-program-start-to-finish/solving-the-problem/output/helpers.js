const helpers = {
  /**
   * Sort an object alphabetically
   * @param {Object} data - an unsorted Object
   * @returns {Object} sorted - sorted object
   */
  sort(data) {
    const sorted = {};
    Object.keys(data).sort().forEach((key) => {
      sorted[key] = data[key];
    });
    return sorted;
  },

  /**
   * Fetch all the titles from an array of objects containing title key
   * @param {Array} data - valid array of objects containing title key
   * @returns {Array} - an array of titles
   */
  fetchTitle(data) {
    return data.map(item => item.title);
  },

  /**
   * Checks if all key in the object is contains null in the array
   * @param {Object} data - Object containing generated indices
   * @returns {Boolean} - true if the vaulues of all keys are null
   */
  allIsEmpty(data) {
    const dataLen = Object.keys(data).length;
    let nullValue = 0;
    Object.keys(data).forEach((i) => {
      if (data[i].indexOf(null) !== -1) {
        nullValue += 1;
      }
    });
    return nullValue === dataLen;
  },

  /**
   * Checks if file is a valid json file
   * @param   {Array} data - file in which to determine validity
   * @returns {Boolean} - true if file is valid and false if otherwise
   */
  isValid(data) {
    if (!data || !Array.isArray(data) || data.length < 1) {
      return false;
    }
    const valid = data.map((book) => {
      if (!book.title || !book.text) {
        return false;
      } else if (typeof book.title === 'string'
      && typeof book.text === 'string') {
        return true;
      }
    });
    return valid.indexOf(false) === -1;
  },

  /**
   * Check if a title is found in an array of titles
   * @param {String} title - title to search for
   * @param {Array} titles - array of titles to search in
   * @returns {Boolean} - true if title was found and false otherwise
   */
  isFound(title, titles) {
    return titles.indexOf(title) !== -1;
  },

  /**
   * Removes special characters from a string and converts to lowercase
   * @param   {String} wholeString - contains a string
   * @returns {String} - a lowercase string without symbols
   */
  stripStr(wholeString) {
    if (typeof wholeString !== 'string') {
      return null;
    }
    return wholeString.replace(/[^a-zA-Z ]/g, '').toLowerCase();
  }
};

module.exports = helpers;
