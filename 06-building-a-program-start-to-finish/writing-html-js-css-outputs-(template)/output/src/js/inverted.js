/**
 *
 * @class InvertedIndex
 */
class InvertedIndex {

  /**
   * Creates an instance of InvertedIndex.
   * @memberOf InvertedIndex
   */
  constructor() {
    this.searchIndices = {};
    this.indexedFiles = {};
  }

  /**
   *
   *
   * @param {Object} eachFile - Javascript object containing file properties
   * @returns {Object} fileContent - content of the read file
   *
   * @memberOf InvertedIndex
   */
  readFile(eachFile) {
    let fileContent;
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          fileContent = JSON.parse(event.target.result);
          const response = InvertedIndex.validateFile(fileContent);
          resolve(response);
        };
        reader.readAsText(eachFile);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
  *
   *
   * @param {Object} jsonContent
   * @returns{Object} isValid - returns true and JSON content file is valid and false otherwise
   * @returns{Object} formatError - returns a name and message if json file has an invalid format
   * @memberOf InvertedIndex
   */
  static validateFile(jsonContent) {
    let isValid = {};
    const formatError = {
      name: 'validate file structure',
      message: 'File structure is invalid'
    };
    if (Object.keys(jsonContent).length === 0 && typeof jsonContent === 'object') {
      isValid = {
        status: false
      };
      return isValid;
    }
    try {
      jsonContent.forEach((doc) => {
        if (!doc.title || !doc.text) {
          throw formatError;
        } else {
          isValid = {
            status: true,
            jsonContent
          };
          return isValid;
        }
      });
    } catch (error) {
      if (error.name === 'validate file structure') return false;
      throw error;
    }
    return isValid;
  }
  /**
   *
   *
   * @static
   * @param {Array} words -takes in an array of words with possible duplicates.
   * @returns{Array} item -returns an array of words without duplicates.
   *
   * @memberOf InvertedIndex
   */
  static uniqueWords(words) {
    if (Array.isArray(words)) {
      const checked = {};
      return words.filter((item) => {
        if (!checked[item]) {
          checked[item] = true;
          return item;
        }
        return null;
      });
    }
    return ['invalid data type supplied'];
  }

  /**
   *
   *
   * @static
   * @param {String} text - a string of spaced words with unwanted characters
   * @returns{String} text - a string of spaced words with no unwanted characters
   *
   * @memberOf InvertedIndex
   */
  static tokenizeWords(text) {
    const invalid = /[.,/#!$%^&*;:{}=\-_`~()]/g;
    text = text.replace(invalid, '');
    return text;
  }
  /**
   *
   *
   * @static
   * @param {Object} docObject - an object containing a string of characters.
   * @returns{Object} docObject - an object containing an array of words.
   *
   * @memberOf InvertedIndex
   */
  static splitAndSort(docObject) {
    const words = docObject.toLowerCase().split(' ').sort();
    docObject = InvertedIndex.uniqueWords(words);
    return docObject;
  }

  /**
   *
   *
   * @static
   * @param {Object} jContent - single object of a JSON formatted file
   * @returns{Object} concatenatedText - returns the concatenated values of object keys
   *
   * @memberOf InvertedIndex
   */
  static concatenateText(jContent) {
    // if a document exists? combine title and text to split at once
    let concatenatedText = {};
    concatenatedText = `${jContent.title} ${jContent.text}`;
    return concatenatedText;
  }

  /**
   *
   *
   * @param {Array} book - contents of a JSON formatted file
   * @param {String} filename - name of the file
   * @returns{Object} this.indexedFiles - contains filenames and their corresponding contents.
   *
   * @memberOf InvertedIndex
   */
  createIndex(book, filename) {
    const indices = {};
    const splittedWords = {};
    book.forEach((doc, key) => {
      const joinedkeys = InvertedIndex.concatenateText(doc);
      const tokenizedWords = InvertedIndex.tokenizeWords(joinedkeys);
      splittedWords[key] = InvertedIndex.splitAndSort(tokenizedWords);
    });
    Object.keys(splittedWords).forEach((keys) => {
      splittedWords[keys].forEach((words) => {
        if (!indices.hasOwnProperty(words)) {
          indices[words] = [Number(keys)];
        } else { indices[words].push(Number(keys)); }
      });
    });
    this.indexedFiles[filename] = indices;
    return this.indexedFiles;
  }

  /**
   *
   *
   * @param {String} filename - the name of the JSON file
   * @returns{Object} this.indexedFiles - displays file title and indices of words in the file
   *
   * @memberOf InvertedIndex
   */
  getIndex(filename) {
    return this.indexedFiles[filename]; // Display a particular file
  }

  /**
   *
   *
   * @param {String} searchWords - the words you require indices for
   * @param {String} searchBook - the name of the file
   * @returns{Object} searchOutput - the words and corresponding indices
   *
   * @memberOf InvertedIndex
   */
  searchIndex(searchWords, searchBook) {
    const searchOutput = {};
    if (typeof searchWords !== 'string') {
      return false;
    }
    searchWords = InvertedIndex.tokenizeWords(searchWords);
    const sortedWords = InvertedIndex.splitAndSort(searchWords);
    if (searchBook !== 'All') {
      const index = this.indexedFiles[searchBook];
      sortedWords.forEach((word) => {
        if (index[word]) {
          searchOutput[word] = index[word];
        } else {
          searchOutput[word] = [];
        }
      });
      this.searchIndices[searchBook] = searchOutput;
    } else {
      const index = this.indexedFiles;
      Object.keys(index).forEach((filename) => {
        const indexedFile = this.indexedFiles[filename];
        sortedWords.forEach((word) => {
          if (indexedFile[word]) {
            searchOutput[word] = indexedFile[word];
          } else {
            searchOutput[word] = [];
          }
        });
        this.searchIndices[filename] = searchOutput;
      });
    }
    return this.searchIndices;
  }
}

module.exports.InvertedIndex = InvertedIndex;
