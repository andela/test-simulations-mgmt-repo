/**
 * The Inverted Index class.
 * @class
 */
class InvertedIndex {

  /**
   * class constructor
   * @constructor
   */
  constructor() {
    this.globalIndex = {};
  }

  /**
   * A method that tokenizes the string that is passed through it
   * @param  {string} text the string  from the "text" key in the JSON
   * @return {Array} containing String.
   */
  static tokenize(text) {
    const terms = text.replace(/[^\w\s]/gi, ' ')
      .match(/\w+/g);
    return terms;
  }

  /**
   * A method that filters the array passed into it for unique words
   * @param {Array} text Array of strings
   * @returns {Array} Returns array of unique words
   */
  static uniqueWords(text) {
    const unique = [...new Set(text)];
    return unique;
  }

  /**
   * A method that tokenizes an object and gets the unique terms in the object
   * @param  {Object} file the uploaded JSON file object
   * @return {Array}  of the unique terms in the file
   */
  static getText(file) {
    let newText = `${' '}`;
    Object.keys(file)
      .forEach((key) => {
        const obj = file[key];
        newText += `${' '}`;
        newText += obj.text;
      });
    const uniqueTerms = InvertedIndex
      .uniqueWords(InvertedIndex.tokenize(newText))
      .map(x => x.toLowerCase());
    return uniqueTerms;
  }

  /**
   * A method to validate a JSON file.
   * it check if the format of the .json file contains
   * strictly keys of ["title","text"]
   * @param {Object} parsedFile object
   * @returns {Object} containing boolean and a String.
   */
  static validateFile(parsedFile) {
    let isValid = {
      valid: false,
      message: 'This is an Invalid JSON File',
    };
    Object.keys(parsedFile)
      .forEach((key) => {
        const uploadedFile = parsedFile[key];
        const validFormat = ['title', 'text'];
        const parsedFileFormat = Object.keys(uploadedFile);
        const fileTextKey = Object.keys(parsedFileFormat)
          .map(objKeys => parsedFileFormat[objKeys]);
        if (validFormat.toString() === fileTextKey.toString()) {
          isValid = {
            valid: true,
            message: 'This JSON Format is correct',
          };
        } else {
          isValid = {
            valid: false,
            message: 'This JSON Format is Incorrect',
          };
        }
      });
    return isValid;
  }

  /**
   * A method that create the index of the selected-file
   * @param  {Object} file the uploaded file object
   * @param  {String} fileName    The file name
   * @return {Object} containing the index of the selected-file
   */
  createIndex(file, fileName) {
    const indexedFiles = {};
    const uniqueTerms = InvertedIndex.getText(file);
    uniqueTerms.forEach((uniqueKeys) => {
      const arr = [];
      file.forEach((jsonObjText) => {
        arr.push((jsonObjText.text.toLowerCase())
          .includes(uniqueKeys));
      });
      indexedFiles[uniqueKeys] = arr;
    });
    this.globalIndex[fileName] = indexedFiles;
    return indexedFiles;
  }

  /**
   * A method that gets the index of a filefrom the database object
   * @param {String} fileName the file name
   * @return {Object} containing keys of filenames and values of Arrays
   */
  getIndex(fileName) {
    return this.globalIndex[fileName];
  }


  /**
   * A method that searches the index of the current file
   * @param  {String} query  the string you are currently typing
   * @param  {String} fileName  the name of the file
   * @return {Object} A filtered down version of the object you are currently
   *                  searching, based on the string you are typing.
   */
  searchIndex(query, fileName) {
    if (fileName !== 'all') {
      const indexedData = this.getIndex(fileName);
      if (query !== undefined && query.length > 0) {
        const keyword = InvertedIndex.tokenize(query);
        this.searchFile = {};
        keyword.forEach((searchKeyUnfiltered) => {
          const searchKey = searchKeyUnfiltered.toLowerCase();
          if (searchKey in indexedData) {
            this.searchFile[searchKey] = indexedData[searchKey];
          }
        });
        return this.searchFile;
      }
      return indexedData;
    }
    if (query !== undefined && query.length > 0) {
      const keyword = InvertedIndex.tokenize(query);
      const fileNames = Object.keys(this.globalIndex);
      const searchFiles = {};
      fileNames.forEach((allFileName) => {
        searchFiles[allFileName] = {};
        keyword.forEach((searchKeyUnfiltered) => {
          const searchKey = searchKeyUnfiltered.toLowerCase();
          const fileKey = Object.keys(this.globalIndex[allFileName]);
          if (fileKey.indexOf(searchKey) > -1) {
            searchFiles[allFileName][searchKey] =
              this.globalIndex[allFileName][searchKey];
          }
        });
      });
      return searchFiles;
    }
    return this.globalIndex;
  }
}
if (typeof window === 'undefined') {
  module.exports.InvertedIndex = InvertedIndex;
}
