/* global FileReader */
/**
 * @class InvertedIndex
 * @classdesc containing the InvertedIndex methods
 */
export default class InvertedIndex {
  /**
   * * @constructor
   * initialises the class base properties
   */
  constructor() {
    this.indices = {};
    this.indexedFiles = {};
    this.uploadedFiles = {};
  }
  /**
   * @createIndex method
   * @param {string} fileName
   * @param {Object} fileContent
   * @returns {boolean} true - index created successfully
   * create index of the fileName
   */
  createIndex(fileName, fileContent) {
    this.indices[fileName] = this.indices[fileName] || {};
    const totalBooks = fileContent.length;
    for (let bookIndex = 0; bookIndex <
      totalBooks; bookIndex += 1) {
      const { title, text } = fileContent[bookIndex],
        tokens = InvertedIndex.tokenize(`${title} ${text}`),
        indices = this.indices[fileName];
      tokens.forEach((token) => {
        if (token in indices) {
          const eachToken = indices[token];
          if (eachToken.indexOf(bookIndex) === -1) {
            indices[token].push(bookIndex);
          }
        } else {
          indices[token] = [bookIndex];
        }
      });
    }

    this.indexedFiles[fileName] = totalBooks;
    return true;
  }

  /**
   * @getIndex method
   * @param {string} fileName - The File Name
   * @returns {Object} The index of the fileName
   * gets the index of the fileName
   */
  getIndex(fileName) {
    return this.indices[fileName];
  }

  /**
  * @booksIndex method
  * @param {string} fileName - The File Name
  * @returns {Array} All books Index
  * get all books index
  */
  booksIndex(fileName) {
    const totalBooks = this.indexedFiles[fileName],
      indexArr = [];
    for (let i = 0; i < totalBooks; i += 1) {
      indexArr.push(i);
    }
    return indexArr;
  }


  /**
   * @tokenize method
   * @param {string} words - The words
   * @returns {Array} The tokenize strings
   * strips out special characters
   */
  static tokenize(words) {
    let value = words;
    value = value.replace(/[&\\#,+()$~%.'":*?<>{}]/g, '')
      .trim()
      .toLowerCase()
      .split(/\s+/);
    return value;
  }

  /**
   * @readFile method
   * @param {string} currentFile - The File Name
   * @returns {Array} contains File Name and Content
   * reads the content of the file
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
   * @param {string} fileContent - Content of File
   * @param {string} fileName - Name of the File
   * @returns {Boolean} true - validation successful
   * validates File Name and Content
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
      const error = `${fileName} is not well formatted`;
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
   * @param {string} keyword - The token to be searched for
   * @param {Array} locations - Where to search for it
   * @returns {Boolean} true - searched successfully
   * Search for token in books
   */
  searchIndex(keyword, locations) {
    try {
      const books = Object.keys(this.indices);
      if (!keyword) {
        const error = 'please enter a keyword to search.';
        throw (error);
      }

      this.finalResult = {};
      if (!locations || books.length === 0) {
        const error = 'No file has been indexed yet';
        throw new Error(error);
      } else {
        locations = locations || Object.keys(this.indices);
      }
      locations.forEach((fileName) => {
        const result = this.getResult(keyword, fileName);
        this.finalResult[fileName] = result;
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * @getResult method
   * @param {string} keyword
   * @param {string} fileName
   * @returns {Array} contains search result
   * get the result of the keyword from the indices
   */
  getResult(keyword, fileName) {
    const searchResult = {},
      keywords = InvertedIndex.cleanValues(keyword),
      fileIndex = this.indices[fileName],
      currentToken = Object.keys(this.indices[fileName]);
    if (keywords.length === 0) {
      const error = 'Search for Aplhanumeric values only';
      throw (error);
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
   * @param {string} word - word to clean
   * @returns {Array} contains cleaned words
   * cleans the keyword for search
   */
  static cleanValues(word) {
    let value = word.replace(/[&\\#,+()$~%.'":*?<>{}]/g, '')
      .replace(/[[|\]]/g, '')
      .toLowerCase()
      .trim()
      .split(/\b\s+(?!$)/);
    value = value.filter(elem => elem !== '');
    return value;
  }
}
