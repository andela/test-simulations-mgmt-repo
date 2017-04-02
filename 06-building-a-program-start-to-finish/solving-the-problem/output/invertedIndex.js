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
    this.unique = [];
    this.tableObj = {};
  }

  /**
   * A method that tokenizes the string that is passed through it
   * @param  {string} data the string that is gotten from the "text" key in the JSON object
   * @return {Array} containing String.
   */
  tokenize(data) {
    this.terms = data.replace(/[^\w\s]/gi, ' ')
      .match(/\w+/g);
    return this.terms;
  }

  /**
   * A method that filters the array passed into it for unique words
   * @param {String} data Array of strings
   * @returns {String} Returns array of unique words
   */
  uniqueWords(data) {
    this.unique = [...new Set(data)];
    return this.unique;
  }

  /**
   * A method that tokenizes an object value and gets the unique terms in the object values
   * @param  {Object} fileJson the uploaded JSON file object
   * @return {Array}  of the unique terms in the fileJson
   */
  getTextFromJsonObj(fileJson) {
    let newText = ' ';
    Object.keys(fileJson)
      .forEach((key) => {
        const obj = fileJson[key];
        newText += ' ';
        newText += obj.text;
      });
    const uniqueTerms = this.uniqueWords(this.tokenize(newText))
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
  validateFile(parsedFile) {
    this.isValid = {
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
          this.isValid = {
            valid: true,
            message: 'This JSON Format is correct',
          };
        } else {
          this.isValid = {
            valid: false,
            message: 'This JSON Format is Incorrect',
          };
        }
      });
    return this.isValid;
  }

  /**
   * A method that create the index of the selected-file
   * @param  {Object} fileJson the uploaded file object
   * @param  {Array} uniqueTerms    the unique terms in the JSON file
   * @param  {String} fileName    The file name
   * @return {Object} containing the index of the selected-file
   */
  createIndex(fileJson, uniqueTerms, fileName) {
    const indexedDB = {};
    uniqueTerms.forEach((uniqueKeys) => {
      const arr = [];
      fileJson.forEach((jsonObjText) => {
        arr.push((jsonObjText.text.toLowerCase())
          .includes(uniqueKeys));
      });
      indexedDB[uniqueKeys] = arr;
    });
    this.tableObj[fileName] = indexedDB;
    return indexedDB;
  }

  /**
   * A method that gets the index of a filefrom the database object
   * @param {String} fileName the file name
   * @return {Object} containing keys of filenames and values of Arrays
   */
  getIndex(fileName) {
    return this.tableObj[fileName];
  }


  /**
   * A method that searches the index of the current file
   * @param  {String} keywords  the string you are currently typing
   * @param  {String} fileName  the name of the file
   * @return {Object} A filtered down version of the object you are currently
   *                  searching, based on the string you are typing.
   */
  searchIndex(query, fileName) {
    if (fileName !== 'all') {
      const indexedData = this.getIndex(fileName);
      if (query !== undefined && query.length > 0) {
        const keyword = this.tokenize(query);
        this.searchData = {};
        keyword.forEach((searchKeyUnfiltered) => {
          const searchKey = searchKeyUnfiltered.toLowerCase();
          if (searchKey in indexedData) {
            this.searchData[searchKey] = indexedData[searchKey];
          }
        });
        return this.searchData;
      }
      return indexedData;
    } else {
      if (query !== undefined && query.length > 0) {
        const keyword = this.tokenize(query)
        const fileNames = Object.keys(this.tableObj);
        this.searchDataAll = {};
        fileNames.forEach((fileName) => {
          this.searchDataAll[fileName] = {};
          keyword.forEach((searchKeyUnfiltered) => {
            const searchKey = searchKeyUnfiltered.toLowerCase();
            const filekey = Object.keys(this.tableObj[fileName]);
            if (filekey.indexOf(searchKey) > -1) {
              this.searchDataAll[fileName][searchKey] = this.tableObj[fileName][searchKey];
            }
          });
        });
        return this.searchDataAll;
      }
      return this.tableObj;
    }
  }
}
if (typeof window === 'undefined') {
  module.exports.InvertedIndex = InvertedIndex;
}
