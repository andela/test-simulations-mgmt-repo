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
   * @returns an array if data
   */
  fetchTitle(data) {
    return data.map(item => item.title);
  },

  /**
   * Check if a title is found in an array of titles
   * @param {String} title - title to search for
   * @param {Array} titles - array of titles to search in
   * @returns boolean
   */
  isFound(title, titles) {
    return titles.indexOf(title) !== -1;
  },

  /**
   * Removes special characters from a string and converts to lower case
   * @param   {String} str - contains a string
   * @returns {String}
   */
  stripStr(str) {
    if (typeof str !== 'string') {
      return null;
    }
    return str.replace(/[^a-zA-Z ]/g, '').toLowerCase();
  }
}

module.exports = helpers;