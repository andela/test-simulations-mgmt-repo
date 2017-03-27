/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * @class InvertedIndex
 */
class InvertedIndex {

  /**
   * Creates an instance of InvertedIndex.
   * @memberOf InvertedIndex
   */
  constructor() {
    this.filesIndexed = {};
  }

  /**
   * getIndex method returns the indexed words and the documents that were found
   * @param {String} fileName - The name of the file to get its index
   * @return {Object} - The index already created
  */
  getIndex(fileName) {
    return this.filesIndexed[fileName] ? this.filesIndexed[fileName] : false;
  }

  /**
   * createIndex method creates an index for a given file
   * @param {String} fileName - The name of the file to create index
   * @param {Array} fileContent - A valid JSON file containg an
   * array of books with title and text
   * @return {Object} - The index already created
   * @memberOf InvertedIndex
   */
  createIndex(fileName, fileContent) {
    const title = InvertedIndexUtility.getBookTitles(fileContent);
    const words = InvertedIndexUtility.getAllWords(fileContent);
    const bookWords = InvertedIndexUtility.getBookWords(fileContent);
    const index = InvertedIndexUtility.constructIndex(words, bookWords, title);

    this.filesIndexed[fileName] = {
      title,
      index
    };
  }

  /**
   * searchIndex Method searches an already created index for matches.
   * @param {String} searchTerms - The terms to search for the index
   * @param {String} fileName - The name of the file to create index
   * @return {Object} - The queried indexed array is returned if a match
   * is found.False is returned if index has not been created
   * @memberOf InvertedIndex
   */
  searchIndex(searchTerms, fileName) {
    let searchResult;
    searchTerms = InvertedIndexUtility.tokenize(searchTerms);
    searchTerms = InvertedIndexUtility.removeDuplicates(searchTerms);
    if (fileName === 'All') {
      const result = [];
      const bookNames = [];
      const fileNames = Object.keys(this.filesIndexed);
      fileNames.forEach((name) => {
        const fileIndexed = this.getIndex(name);
        bookNames.push(fileIndexed.title);
        result.push(InvertedIndexUtility
        .filterIndexed(searchTerms, fileIndexed.index));
      });
      searchResult = { title: bookNames, index: result };
    } else {
      const fileIndexed = this.getIndex(fileName);
      const bookNames = fileIndexed.title;
      const result = InvertedIndexUtility
      .filterIndexed(searchTerms, fileIndexed.index);
      searchResult = { title: bookNames, index: result };
    }
    return searchResult;
  }

}

