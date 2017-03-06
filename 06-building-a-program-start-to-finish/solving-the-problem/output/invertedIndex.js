/**
 * @class InvertedIndex
 */
class InvertedIndex {
  /**
   * Creates an instance of InvertedIndex.
   * @param {Object} fileUploaded
   * @memberOf InvertedIndex
   */
  constructor(fileUploaded) {
    this.uploadedFile = fileUploaded;
  }
  /**
   * logFile (returns the file that has been uploaded)
   * @returns {Object} - returns the file that has been uploaded
   * @memberOf InvertedIndex
   */
  logFile() {
    return this.uploadedFile;
  }
  /**
   * checkFileExtension (it returns the file extension)
   * @param {string} uploadedFileName
   * @return {string} - returns a string of the file extension of the uploaded file
   * @memberOf InvertedIndex
   */
  checkFileExtension(uploadedFileName) {
    const array = uploadedFileName.split('.');
    return array[array.length - 1];
  }
  /**
   * checkIfJson (it returns true if the file extension is .json)
   * @param {string} uploadedFileName
   * @returns {boolean} - returns true if the file extension is json else false
   * @memberOf InvertedIndex
   */
  checkIfJson(uploadedFileName) {
    const fileExtension = this.checkFileExtension(uploadedFileName);
    return fileExtension.toLowerCase() === 'json';
  }
  /**
   * containsTitleText (it checks if the content of the file contains title and text)
   * @returns {Boolean} - returns true if the file contains title and text or false if it does not
   * @memberOf InvertedIndex
   */
  containsTitleText() {
    for (let arrayIndex = 0; arrayIndex < this.uploadedFile.length; arrayIndex++) {
      if (('title' in this.uploadedFile[arrayIndex]) && ('text' in this.uploadedFile[arrayIndex])) {
        return true;
      }
    }
    return false;
  }
  /**
   * getTitlesAndTexts (it gets all the titles and texts in the uploaded file)
   * @returns {Object} - returns an object with keys titles and texts
   * @memberOf InvertedIndex
   */
  getTitlesAndTexts() {
    const objectToReturn = [{ titles: [] }, { texts: [] }];

    this.uploadedFile.forEach((e) => {
      objectToReturn[0].titles.push(e.title.split(':')[0]);
      objectToReturn[1].texts.push(e.text);
    });

    return objectToReturn;
  }
  /**
   * getIndexedWords (it returns an array of indexed words)
   * @returns {Array} - returns an array of indexed words
   * @memberOf InvertedIndex
   */
  getIndexedWords() {
    let uncleanIndexedWords = '';
    const fileToIndex = this.getTitlesAndTexts();

    fileToIndex[1].texts.forEach((e) => {
      uncleanIndexedWords += `${e} `;
    });

    const cleanIndexedWords = this.cleanIndexedWords(uncleanIndexedWords);
    // To remove the empty space at the end of the cleanIndexedWords array
    cleanIndexedWords.pop();
    return cleanIndexedWords;
  }
  /**
   * cleanIndexedWords (it returns an array of words without commas,
   * fullstop, spaces and also unique words)
   * @param {string} uncleanWords
   * @returns {Array} - an array of unique words
   * @memberOf InvertedIndex
   */
  cleanIndexedWords(uncleanWords) {
    const cleanWords = uncleanWords.replace(/\.|,/g, '').split(' ');
    return cleanWords.filter((element, index) => {
      return cleanWords.indexOf(element) === index}
    );
  }
  /**
   * contentToDisplay (it returns an Object of data to display to the user)
   * @returns {Array} - an array of indexed word in a format that can be displayed to the users
   * @memberOf InvertedIndex
   */
  contentToDisplay() {
    const displayIndexedWords = [];
    const fileToDisplay = this.getTitlesAndTexts();
    const indexedWords = this.getIndexedWords();
    displayIndexedWords.push(indexedWords);

    for (let arrayIndex = 0; arrayIndex < fileToDisplay[1].texts.length; arrayIndex++) {
      const temporaryData = [];
      const newIndexedWords = this.cleanIndexedWords(fileToDisplay[1].texts[arrayIndex]);

      indexedWords.forEach((e) => {
        if (newIndexedWords.includes(e)) {
          temporaryData.push(true);
        } else {
          temporaryData.push(false);
        }
      });

      displayIndexedWords.push(temporaryData);
    }

    return displayIndexedWords;
  }
  /**
   * displayInTableFormat (it returns an Object of data to display to the user in table format)
   * @returns {Array} - the array contains data to be displayed in table format
   * @memberOf InvertedIndex
   */
  displayInTableFormat() {
    const dataToFormat = this.contentToDisplay();
    const formatedData = [];

    for (let arrayIndex = 0; arrayIndex < dataToFormat[0].length; arrayIndex++) {
      formatedData.push(this.returnElementsAtIndex(arrayIndex, dataToFormat.length, dataToFormat));
    }
    return formatedData;
  }
  /**
   * returnElementsAtIndex (it returns an Object of data which
   * contains elements at the index specified to be returned)
   * @param {number} currentIndex
   * @param {number} dataLength
   * @param {Object} dataToFormat
   * @returns {Array} - the array returns the row of elements to display
   * @memberOf InvertedIndex
   */
  returnElementsAtIndex(currentIndex, dataLength, dataToFormat) {
    const elementsToReturn = [];
    for (let arrayIndex = 0; arrayIndex < dataLength; arrayIndex++) {
      elementsToReturn.push(dataToFormat[arrayIndex][currentIndex]);
    }
    return elementsToReturn;
  }
  /**
   * searchIndexedWords (it returns an Object of data which contains search
   * results for word/words searched against the indexed words)
   * @param {Array} wordsToSearch
   * @returns {Array} - an array of found words to be displayed on the table
   * @memberOf InvertedIndex
   */
  searchIndexedWords(wordsToSearch) {
    const foundWords = [];
    const temporaryData = [];

    const wordsToCheck = this.displayInTableFormat();
    for (let arrayIndex = 0; arrayIndex < wordsToCheck.length; arrayIndex++) {
      if (wordsToSearch.includes(wordsToCheck[arrayIndex][0])) {
        foundWords.push(wordsToCheck[arrayIndex]);
      }
    }

    if (foundWords.length === 0) {
      for (let arrayIndex = 0; arrayIndex < wordsToCheck[0].length; arrayIndex++) {
        if (arrayIndex === 0) {
          temporaryData.push('no results');
        } else {
          temporaryData.push(false);
        }
      }
      foundWords.push(temporaryData);
    }

    return foundWords;
  }
}




