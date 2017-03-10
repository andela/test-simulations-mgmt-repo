
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
    this.indexedFiles = {};
    this.searchResults = {};
  }

  /** creates index and update the indexed files
   * @param {object} uploadedFiles - object containing uploaded books
   * @param {Sting} file - file name
   * @return  {object}  - this.indexedFiles
   */
  updateIndexedFilesRecords(uploadedFiles, file) {
    this.selectedBook = uploadedFiles[file].content;
    this.validateContent = helpers.validFileContent(this.selectedBook);
    if (this.validateContent) {
      this.filteredContents = helpers.filterBookContents(this.selectedBook);
      this.tokens = helpers.getToken(this.filteredContents);
      if (!(this.indexedFiles.hasOwnProperty(file))) {
        this.indexedFiles[file] = this.createIndex(this.tokens,
        this.filteredContents);
      }
      return this.indexedFiles;
    }
    return null;
  }

/** creates index for selected files
  * @param {Array} tokens - an array of filtered words in book
  * @param {Array} filteredContents - an array of all contents in selectedBook
  * @return  {object}  - this.wordMap;- A map of tokens to their indexes
  */
  createIndex(tokens, filteredContents) {
    this.wordMap = {};
    tokens.forEach((token) => {
      filteredContents.forEach((document) => {
        if (document.includes(token)) {
          if (!this.wordMap[token]) {
            this.wordMap[token] = [true];
          } else {
            this.wordMap[token].push(true);
          }
        } else if (!this.wordMap[token]) {
          this.wordMap[token] = [false];
        } else {
          this.wordMap[token].push(false);
        }
      });
    });
    return this.wordMap;
  }

  /** updates searches object with search results
   * @param {String} file - name of file to search from
   * @param {Array} queries - Array of tokens to search
   * @return  {object}  - tokens and searchResults of searched tokens
   */
  updateSearchResult(file, queries) {
    const search = this.searchIndex(queries,
    this.indexedFiles[file]);
    this.searchResults[file] = search;
    return this.searchResults;
  }

 /** search for words in indexFiles and return the result
  * @param {Array} queries - search words
  * @param {object} selectedFileIndexMap - indexMap for selected file
  * @return  {object}  - this.searchMap map of search token to it searchResult
  */
  searchIndex(queries, selectedFileIndexMap) {
    this.searchMap = {};
    queries.forEach((query) => {
      if (query in selectedFileIndexMap) {
        this.searchMap[query] = selectedFileIndexMap[query];
      } else {
        this.searchMap[query] = Array(3).fill(false);
      }
    });
    return this.searchMap;
  }
}

