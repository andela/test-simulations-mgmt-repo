const truebook = require('../example.json');
const falseBook = require('../package.json');

describe('Tests the invertedIndex.js class: ', () => {
  const invertedIndexTrue = new InvertedIndex(truebook);
  const invertedIndexFalse = new InvertedIndex(falseBook);

  describe('Checks if file extension is json', () => {
    it('should return true for .json file', () => {
    expect(invertedIndexTrue.checkIfJson('example.json')).toEqual(true);
    });

    it('should return false for .txt file', () => {
    expect(invertedIndexTrue.checkIfJson('example.txt')).toEqual(false);
    });
  });

  describe('Checks if uploaded file contains title and text', () => {
    it('should return true for truebook', () => {
    expect(invertedIndexTrue.containsTitleText()).toEqual(true);
    });

    it('should return false for falsebook', () => {
    expect(invertedIndexFalse.containsTitleText()).toEqual(false);
    });
  });

  describe('Checks if value returned by getTitlesAndTexts() is an object',
  () => {
    const returnedObject = invertedIndexTrue.getTitlesAndTexts();

    it('should return true for instanceof returnedObject', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('Checks if object returned by getTitlesAndTexts() is of length 2',
  () => {
    const returnedObject = invertedIndexTrue.getTitlesAndTexts();

    it('should return 2', () => {
    expect(returnedObject.length).toEqual(2);
    });
  });

  describe('Checks if value returned by getIndexedWords() is an object', () => {
    const returnedObject = invertedIndexTrue.getIndexedWords();

    it('should return true for instanceof returnedObject', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('Checks the value returned by contentToDisplay()', () => {
    const returnedObject = invertedIndexTrue.contentToDisplay();
    const bool = (returnedObject[0].length === returnedObject[1].length);

    it('should return true if the values at indexes are equal', () => {
    expect(bool).toEqual(true);
    });

    it('should return true for instanceof returnedObject', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('Checks the value returned by displayInTableFormat()', () => {
    const returnedObject = invertedIndexTrue.displayInTableFormat();
    const bool = (returnedObject[0].length === returnedObject[1].length);

    it('should return true if the values at indexes are equal', () => {
    expect(bool).toEqual(true);
    });

    it('should return true for instanceof returnedObject', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('Checks if the value returned by searchIndexedWords() is an Object',
  () => {
    const returnedObject = invertedIndexTrue.searchIndexedWords(
      ['quick', 'An', 'unusual']);

    it('should return true for instanceof returnedObject', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });
});
