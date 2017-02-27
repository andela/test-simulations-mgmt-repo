
/**
 * function should generate index when a valid json file is passesd in
 * @param {any} data
 * @returns
 */
function generateIndex(data) {
  if (data === undefined || data === null) return null;
  if (data.constructor !== Array) return null;
  if (!this.isValid(data)) return null;
  const index = {};
  data.map((book) => {
    const text = book.text.replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ');
    text.forEach((word) => {
      if (index[word]) {
        const wordArray = index[word];
        if (wordArray.indexOf(book.title) === -1) {
          wordArray.push(book.title);
          index[word] = wordArray;
        }
      } else {
        index[word] = [book.title];
      }
    });
    return null;
  });

  // sort is found in helper.js
  const sortedIndex = sort(index);
  return sortedIndex;
}

/**
 *
 * function should search through a generated Index
 * @param {any} query
 * @param {any} data
 * @returns
 */
function search(query, data) {
  const words = Object.keys(data);
  const queryArray = query.replace(/[^A-Za-z ]/g, '').toLowerCase().split(' ');
  const result = {};
  queryArray.forEach((q) => {
    if (words.indexOf(q) !== -1) {
      result[q] = data[q];
    }
  });
  return result;
}

/**
 *
 * function checks if json file is in valid format
 * @param {any} data
 * @returns
 */
function isValid(data) {
  if (!data) return false;
  if (data.constructor !== Array) return false;
  if (data.length < 1) return false;
  const valid = data.map(book => (((
      !book.title || !book.text) ? false :
      (book.title.constructor === String && book.text.constructor === String))));
  return (valid.indexOf(false) === -1);
}

/**
 *
 * function searches for query in an array of generated index
 * @param {any} query
 * @param {any} dataset
 * @returns
 */
function searchAll(query, dataset) {
  const searchResults = {};
  dataset.forEach((data) => {
    searchResults[data.name] = this.search(query, data.data);
  });
  return searchResults;
}
/**
 * @class InvertedIndex
 */
class InvertedIndex {

  /**
   * Creates an instance of InvertedIndex.
   * @memberOf InvertedIndex
   */
  constructor() {
    this.generated_index = {};
    // fetchTitle is found in helpers.js
    this.fetchTitle = fetchTitle;
    // isFound is found in helpers.js
    this.isFound = isFound;
    this.isValid = isValid;
    this.generateIndex = generateIndex;
    this.search = search;
    this.searchAll = searchAll;
  }
}
