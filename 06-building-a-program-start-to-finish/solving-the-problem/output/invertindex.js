/*eslint-disable */
/* global FileReader */
/**
 * @class InvertedIndex
 * @classdesc blah blah
 */
class InvertedIndex {
  /**
   * * @constructor
   * initialises the class base properties
   */
  constructor() {
    this.indicies = {};
    this.indexedFiles = {};
    this.uploadedFiles = {};
  }
  /*eslint-enable */
  /**
   * @createIndex method
   * @param {fileName} fileName
   * @param {fileContent} fileContent
   * @returns {boolean}
   * create index of the fileName
   */
  createIndex(fileName, fileContent) {
    this.indicies[fileName] = this.indicies[fileName] || {};
    const numOfBooks = fileContent.length;
    for (let bookIndex = 0; bookIndex <
      numOfBooks; bookIndex += 1) {
      const { title, text } = fileContent[bookIndex];
      const tokens = InvertedIndex.tokenize(`${title} ${text}`);
      const indicies = this.indicies[fileName];
      tokens.forEach((token) => {
        if (token in indicies) {
          const eachToken = indicies[token];
          if (eachToken.indexOf(bookIndex) === -1) {
            indicies[token].push(bookIndex);
          }
        } else {
          // Initially this is what happens
          indicies[token] = [bookIndex];
        }
      });
    }

    this.indexedFiles[fileName] = numOfBooks;
    return true;
  }

  /**
   * @getIndex method
   * @param {fileName} fileName
   * @returns {Object}
   * gets the index of the fileName
   */
  getIndex(fileName) {
    return this.indicies[fileName];
  }

   /**
   * @getNumofBooks method
   * @param {fileName} fileName
   * @returns {Array}
   * create index of the fileName
   */
  getNumOfBooks(fileName) {
    const numOfBooks = this.indexedFiles[fileName];
    const indexArr = [];
    for (let i = 0; i < numOfBooks; i += 1) {
      indexArr.push(i);
    }
    return indexArr;
  }


  /**
   * @tokenize method
   * @param {str} str
   * @returns {Array}
   * create index of the fileName
   */
  static tokenize(str) {
    let value = str;
    value = value.replace(/[&\\#,+()$~%.'":*?<>{}]/g, '')
    .trim()
    .toLowerCase()
    .split(/\s+/);
    return value;
  }

  /**
   * @readFile method
   * @param {currentFile} currentFile
   * @returns {Array}
   * reads the content of the book
   */
  static readFile(currentFile) {
    return new Promise((resolve, reject) => {
      const bookReader = new FileReader();
      bookReader.onload = (function onload() {
        return (readObj) => {
          const tranFile = [];
          const fileName = currentFile.name;
          const fileContent = readObj.target.result;
          try {
            InvertedIndex.validateFile(fileContent, fileName);
            const content = JSON.parse(fileContent);
            tranFile.push(fileName);
            tranFile.push(content);
            resolve(tranFile);
          } catch (e) {
            reject(e);
          }
        };
      })(currentFile);
      bookReader.readAsText(currentFile);
    });
  }
  /**
   * @validateFile method
   * @param {fileContent} fileContent
   * @param {fileName} fileName
   * @returns {Boolean}
   * reads the content of the book
   */
  static validateFile(fileContent, fileName) {
    const fileExt = fileName.split('.').pop();
    if (fileExt !== 'json') {
      const error = `${fileName} has an Invalid File extension, JSON only`;
      throw new Error(error);
    }
    try {
      JSON.parse(fileContent);
    } catch (e) {
      const error = `OOPS!!! ${fileName} is not well formatted`;
      throw new Error(error);
    }
    const content = JSON.parse(fileContent);
    if (content.length === 0) {
      const error = `${fileName} is an empty JSON file`;
      throw new Error(error);
    }
    content.forEach((elem) => {
      if (!Object.keys(elem).includes('title')
          || !Object.keys(elem).includes('text')) {
        const error = `OOPS!!! ${fileName} does not contain title and text`;
        throw new Error(error);
      }
    });
    return true;
  }

  /**
   * @searchIndex method
   * @param {keyword} keyword
   * @param {locations} locations
   * @returns {Boolean}
   * reads the content of the book
   */
  searchIndex(keyword, locations) {
    const self = this;
    const books = Object.keys(self.indicies);
    if (!keyword) {
      const error = 'please enter a keyword to search.';
      throw new Error(error);
    }

    self.finalResult = {};
    if (!locations || books.length === 0) {
      const error = 'No file has been indexed yet';
      throw new Error(error);
    } else {
      locations = locations || Object.keys(this.indicies);
    }
    locations.forEach((fileName) => {
      const result = this.getResult(keyword, fileName);
      self.finalResult[fileName] = result;
    });
    return true;
  }

  /**
   * @getResult method
   * @param {keyword} keyword
   * @param {fileName} fileName
   * @returns {Array}
   * get the result of the keyword from the indicies
   */
  getResult(keyword, fileName) {
    const searchResult = {};
    const keywords = InvertedIndex.cleanValues(keyword);
    const fileIndex = this.indicies[fileName];
    const currentToken = Object.keys(this.indicies[fileName]);
    keywords.forEach((elem) => {
      if (currentToken.includes(elem)) {
        searchResult[elem] = fileIndex[elem];
      } else {
        searchResult[elem] = [];
      }
    });
    return searchResult;
  }

  /**
   * @cleanValues method
   * @param {str} str
   * @returns {Array}
   * cleans the keyword for search
   */
  static cleanValues(str) {
    const value = str.replace(/[&\\#,+()$~%.'":*?<>{}]/g, ' ')
    .toLowerCase()
    .split(/\b\s+(?!$)/);
    return value;
  }
}
