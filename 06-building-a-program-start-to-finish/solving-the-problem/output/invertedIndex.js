/* global FileReader */
/* global InvertedIndex */
/**
 * @class InvertedIndex
 * @classdesc blah blah
 */
/* eslint-disable */
class InvertedIndex {
  /* eslint-enable */
  /**
   * * @constructor
   * initialises the class base properties
   */
  constructor() {
    this.indicies = {};
    this.indexedFiles = {};
    this.uploadedFiles = {};
  }
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
      const { title, text } = fileContent[bookIndex],
        tokens = InvertedIndex.tokenize(`${title} ${text}`),
        indicies = this.indicies[fileName];
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
    const numOfBooks = this.indexedFiles[fileName],
      indexArr = [];
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
          const tranFile = [],
            fileName = currentFile.name,
            fileContent = readObj.target.result;
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
    let content;
    try {
      content = JSON.parse(fileContent);
    } catch (e) {
      const error = `OOPS!!! ${fileName} is not well formatted`;
      throw new Error(error);
    }
    if (content.length === 0) {
      const error = `${fileName} is an empty JSON file`;
      throw new Error(error);
    }
    content.forEach((elem) => {
      if (!elem.title || !elem.text) {
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
    const books = Object.keys(this.indicies);
    if (!keyword) {
      const error = 'please enter a keyword to search.';
      throw new Error(error);
    }

    this.finalResult = {};
    if (!locations || books.length === 0) {
      const error = 'No file has been indexed yet';
      throw new Error(error);
    } else {
      locations = locations || Object.keys(this.indicies);
    }
    locations.forEach((fileName) => {
      const result = this.getResult(keyword, fileName);
      this.finalResult[fileName] = result;
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
    const searchResult = {},
      keywords = InvertedIndex.cleanValues(keyword),
      fileIndex = this.indicies[fileName],
      currentToken = Object.keys(this.indicies[fileName]);
    if (keywords.length === 0) {
      throw new Error('Search for Aplhanumeric values only not special character');
    }
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
    let value = str.replace(/[&\\#,+()$~%.'":*?<>{}]/g, '')
    .replace(/[[|\]]/g, '')
    .toLowerCase()
    .trim()
    .split(/\b\s+(?!$)/);
    value = value.filter(elem => elem !== '');
    return value;
  }
}
