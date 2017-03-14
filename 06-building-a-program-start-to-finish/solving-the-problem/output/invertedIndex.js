/* eslint-disable no-undef */
/**
 * InvertedIndex class with constructor
 * @class
 */
class InvertedIndex {

  /**
   * Creates an instance of InvertedIndex.
   * @memberOf InvertedIndex
   */
  constructor() {
    this.indices = {};
    this.searchResults = {};
  }

  /** invokes the 'createIndex' function and updates this.indices
   * with the index created
   * @param {object} uploads - object containing all uploaded files
   * @param {String} fileName - the file name in which it index is desired
   * @return  {object}  this.indices - the object containing
   *  all indexed files and their indices
   */
  createIndex(uploads, fileName) {
    const fileContent = uploads[fileName].content;
    const isValid = helpers.validFileContent(fileContent);
    if (isValid) {
      const filteredContent = helpers.filterFileContent(fileContent);
      const tokens = helpers.getToken(filteredContent);
      if (!(fileName in this.indices)) {
        const wordMap = {};
        tokens.forEach((token) => {
          filteredContent.forEach((document) => {
            if (document.includes(token)) {
              if (!wordMap[token]) {
                wordMap[token] = [true];
              } else {
                wordMap[token].push(true);
              }
            } else if (!wordMap[token]) {
              wordMap[token] = [false];
            } else {
              wordMap[token].push(false);
            }
          });
        });
        this.indices[fileName] = wordMap;
      }
      console.log(this.indices);
      return this.indices;
    }
    return null;
  }

  /** search index of queries and updates searchResults object
   * @param {String} fileName - name of file to search from
   * @param {Array} queries - Array of tokens to search
   * @return  {object}  - tokens and searchResults of searched tokens
   */
  searchIndex(fileName, queries) {
    const searchMap = {};
    queries.forEach((query) => {
      if (query in this.indices[fileName]) {
        searchMap[query] = this.indices[fileName][query];
      } else {
        searchMap[query] = Array(3).fill(false);
      }
    });
    this.searchResults[fileName] = searchMap;
    return this.searchResults;
  }
}

