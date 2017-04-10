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
   * @param {Object} file - Javascript object containing file properties
   * @returns {Object} response - JSON content of the read file
   *
   * @memberOf InvertedIndex
   */
  static readFile(file) {
    let fileContent;
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          fileContent = JSON.parse(event.target.result);
          const response = InvertedIndex.validateFile(fileContent);
          resolve(response);
        };
        reader.readAsText(file);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
  *
   *
   * @param {Object} jsonContent - file content
   * @returns{Object} isValid - returns true and JSON content for valid files
   * and false for invalid files
   * @memberOf InvertedIndex
   */
  static validateFile(jsonContent) {
    let isValid = { status: false };
    const invalidStructureError = {
      name: 'validate file structure',
      message: 'File structure is invalid'
    };
    if (Object.keys(jsonContent).length === 0 &&
       typeof jsonContent === 'object') {
      return isValid;
    }
    try {
      jsonContent.forEach((doc) => {
        if (!doc.title || !doc.text) {
          throw invalidStructureError;
        } else {
          isValid = {
            status: true,
            jsonContent
          };
          return isValid;
        }
      });
    } catch (error) {
      if (error.name === 'validate file structure') return isValid;
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
   * @returns{String} term -
   *  a string of spaced words with no unwanted characters
   *
   * @memberOf InvertedIndex
   */
  static removeBadCharacters(text) {
    const invalid = /[.,/#!$%^&*;:{}=\-_`~()]/g;
    const term = text.replace(invalid, '');
    return term;
  }
  /**
   *
   *
   * @static
   * @param {String} document
   * @returns{Array} words - an array of unique words.
   *
   * @memberOf InvertedIndex
   */
  static tokenizeText(document) {
    let words = document.toLowerCase().split(' ').sort();
    words = InvertedIndex.uniqueWords(words);
    return words;
  }

  /**
   *
   *
   * @static
   * @param {Object} document - single object of a JSON formatted file
   * @returns{String} concatenatedText -
   *  returns the concatenated values of object keys
   *
   * @memberOf InvertedIndex
   */
  static concatenateText(document) {
    // if a document exists? combine title and text to split at once
    let concatenatedText = '';
    concatenatedText = `${document.title} ${document.text}`;
    return concatenatedText;
  }

  /**
   *
   *
   * @param {Array} validatedFileContent - contents of a valid JSON file
   * @param {String} fileName - name of the file
   * @returns{Object} this.indexedFiles -
   *  contains filenames title and indices of words in the file.
   *
   * @memberOf InvertedIndex
   */
  createIndex(validatedFileContent, fileName) {
    const indices = {};
    const documentWords = {};
    validatedFileContent.forEach((document, key) => {
      const concatenatedText = InvertedIndex.concatenateText(document);
      const text = InvertedIndex.removeBadCharacters(concatenatedText);
      documentWords[key] = InvertedIndex.tokenizeText(text);
    });
    Object.keys(documentWords).forEach((keys) => {
      documentWords[keys].forEach((word) => {
        if (!Object.prototype.hasOwnProperty.call(indices, word)) {
          indices[word] = [Number(keys)];
        } else { indices[word].push(Number(keys)); }
      });
    });
    this.indexedFiles[fileName] = indices;
    return this.indexedFiles;
  }

  /**
   *
   *
   * @param {String} fileName - the name of the JSON file
   * @returns{Object} this.indexedFiles -
   *  contains file title and indices of words in the file
   *
   * @memberOf InvertedIndex
   */
  getIndex(fileName) {
    return this.indexedFiles[fileName]; // Display a particular file
  }

  /**
   *
   *
   * @param {String} searchWords - the words being searched for
   * @param {String} nameOfFile
   * @returns{Object} this.searchIndices - the words and corresponding indices
   *
   * @memberOf InvertedIndex
   */
  searchIndex(searchWords, nameOfFile) {
    const searchOutput = {};
    if (typeof searchWords !== 'string') {
      return false;
    }
    searchWords = InvertedIndex.removeBadCharacters(searchWords);
    const tokenizedText = InvertedIndex.tokenizeText(searchWords);
    if (nameOfFile !== 'All') {
      const index = this.indexedFiles[nameOfFile];
      tokenizedText.forEach((word) => {
        if (index[word]) {
          searchOutput[word] = index[word];
        } else {
          searchOutput[word] = [];
        }
      });
      this.searchIndices[nameOfFile] = searchOutput;
    } else {
      const index = this.indexedFiles;
      Object.keys(index).forEach((fileName) => {
        const indexedFile = this.indexedFiles[fileName];
        tokenizedText.forEach((word) => {
          if (indexedFile[word]) {
            searchOutput[word] = indexedFile[word];
          } else {
            searchOutput[word] = [];
          }
        });
        this.searchIndices[fileName] = searchOutput;
      });
    }
    return this.searchIndices;
  }
}

module.exports.InvertedIndex = InvertedIndex;
