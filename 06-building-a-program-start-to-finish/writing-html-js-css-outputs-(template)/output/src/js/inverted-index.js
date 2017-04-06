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
   * @returns {Object} fileContent - content of the read file
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
   * @param {Object} jsonContent
   * @returns{Object} isValid - returns true and JSON content for valid files
   * @returns{Object} invalidStructureError - returns a name and message
   *   for invalid content
   * @memberOf InvertedIndex
   */
  static validateFile(jsonContent) {
    let isValid = {};
    const invalidStructureError = {
      name: 'validate file structure',
      message: 'File structure is invalid'
    };
    if (Object.keys(jsonContent).length === 0 &&
       typeof jsonContent === 'object') {
      isValid = {
        status: false
      };
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
   * @returns{String} text -
   *  a string of spaced words with no unwanted characters
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
   * @param {Object} doc - an object containing a string of characters.
   * @returns{Object} docObject - an object containing an array of words.
   *
   * @memberOf InvertedIndex
   */
  static splitAndSort(doc) {
    const words = doc.toLowerCase().split(' ').sort();
    doc = InvertedIndex.uniqueWords(words);
    return doc;
  }

  /**
   *
   *
   * @static
   * @param {Object} doc - single object of a JSON formatted file
   * @returns{Object} concatenatedText -
   *  returns the concatenated values of object keys
   *
   * @memberOf InvertedIndex
   */
  static concatenateText(doc) {
    // if a document exists? combine title and text to split at once
    let concatenatedText = {};
    concatenatedText = `${doc.title} ${doc.text}`;
    return concatenatedText;
  }

  /**
   *
   *
   * @param {Array} file - contents of a JSON formatted file
   * @param {String} filename - name of the file
   * @returns{Object} this.indexedFiles -
   *  contains filenames and their corresponding contents.
   *
   * @memberOf InvertedIndex
   */
  createIndex(file, filename) {
    const indices = {};
    const docWords = {};
    file.forEach((doc, key) => {
      const joinedkeys = InvertedIndex.concatenateText(doc);
      const tokenizedWords = InvertedIndex.tokenizeWords(joinedkeys);
      docWords[key] = InvertedIndex.splitAndSort(tokenizedWords);
    });
    Object.keys(docWords).forEach((keys) => {
      docWords[keys].forEach((word) => {
        if (!Object.prototype.hasOwnProperty.call(indices, word)) {
          indices[word] = [Number(keys)];
        } else { indices[word].push(Number(keys)); }
      });
    });
    this.indexedFiles[filename] = indices;
    return this.indexedFiles;
  }

  /**
   *
   *
   * @param {String} filename - the name of the JSON file
   * @returns{Object} this.indexedFiles -
   *  displays file title and indices of words in the file
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
   * @param {String} file - the name of the file
   * @returns{Object} searchOutput - the words and corresponding indices
   *
   * @memberOf InvertedIndex
   */
  searchIndex(searchWords, file) {
    const searchOutput = {};
    if (typeof searchWords !== 'string') {
      return false;
    }
    searchWords = InvertedIndex.tokenizeWords(searchWords);
    const sortedWords = InvertedIndex.splitAndSort(searchWords);
    if (file !== 'All') {
      const index = this.indexedFiles[file];
      sortedWords.forEach((word) => {
        if (index[word]) {
          searchOutput[word] = index[word];
        } else {
          searchOutput[word] = [];
        }
      });
      this.searchIndices[file] = searchOutput;
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
