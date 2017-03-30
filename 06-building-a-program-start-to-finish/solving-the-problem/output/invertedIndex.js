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
   * returns the object containing all the uploadef files
   * @return {Object} Index of all the files 
   */
  searchAllFiles() {
    return this.tableObj;
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
   * @param  {Object} fileJsonObject the uploaded JSON file object
   * @return {Array}  of the unique terms in the fileJsonObject
   */
  getTextFromJsonObj(fileJsonObject) {
    let newText = ' ';
    Object.keys(fileJsonObject)
      .forEach((key) => {
        const obj = fileJsonObject[key];
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
   *  strictly keys of ["title","text"]
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
        const obj = parsedFile[key];
        const validFormat = ['title', 'text'];
        const parsedFileFormat = Object.keys(obj);
        const arr = Object.keys(parsedFileFormat)
          .map(objKeys => parsedFileFormat[objKeys]);
        if (validFormat.toString() === arr.toString()) {
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
   * @param  {Object} fileJsonObject the uploaded file object
   * @param  {Array} uniqueTerms    the unique terms in the JSON file
   * @param  {String} fileName    The file name
   * @return {Object}  containing the index of the selected-file 
   */
  createIndex(fileJsonObject, uniqueTerms, fileName) {
    const indexedDB = {};
    uniqueTerms.forEach((uniqueKeys) => {
      const arr = [];
      fileJsonObject.forEach((jsonObjText) => {
        arr.push((jsonObjText.text.toLowerCase())
          .includes(uniqueKeys));
      });
      indexedDB[uniqueKeys] = arr;
    });
    this.tableObj[fileName] = indexedDB;
    console.log(JSON.stringify(indexedDB));
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
  searchIndex(keywords, fileName) {
    let indexedData = this.getIndex(fileName);
    if (keywords !== undefined && keywords.length > 0) {
      const keyword = keywords.replace(/[^\w\s]/gi, ' ')
        .match(/\w+/g);
      this.searchData = {};
      keyword.forEach((KEY) => {
        const key = KEY.toLowerCase();
        if (key in indexedData) {
          this.searchData[key] = indexedData[key];
        }
      });
      return this.searchData;
    }
    return indexedData;
  }

}
if (typeof window === 'undefined') {
  module.exports.InvertedIndex = InvertedIndex;
}
