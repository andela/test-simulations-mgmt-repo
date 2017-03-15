const truebook = require('../example.json');
const falseBook = require('../package.json');
const emptyBook = require('../emptyFile.json');

describe('Tests the InvertedIndex class: ', () => {
  const invertedIndexTrue = new InvertedIndex(truebook);
  const invertedIndexFalse = new InvertedIndex(falseBook);
  const InvertedIndexEmpty = new InvertedIndex(emptyBook);

  describe('InvertedIndex: is instance of a class', () => {
    it('should return true for instance of invertedIndexTrue', () => {
    expect(invertedIndexTrue instanceof Object).toBeTruthy();
    expect(invertedIndexFalse instanceof Object).toBeTruthy();
    expect(InvertedIndexEmpty instanceof Object).toBeTruthy();
    });
  });

  describe('InvertedIndex: checks if methods are defined', () => {
    it('should check if method is defined in InvertedIndex', () => {
    expect(invertedIndexTrue.getTitlesAndTexts).toBeDefined();
    expect(invertedIndexTrue.checkIfJson).toBeDefined();
    expect(invertedIndexTrue.containsTitleText).toBeDefined();
    expect(invertedIndexTrue.contentToDisplay).toBeDefined();
    expect(invertedIndexTrue.displayInTableFormat).toBeDefined();
    expect(invertedIndexTrue.getIndexedWords).toBeDefined();
    expect(invertedIndexTrue.cleanIndexedWords).toBeDefined();
    expect(invertedIndexTrue.searchIndexedWords).toBeDefined();
    });
  });

  describe('InvertedIndex: checks file extension', () => {
    it('should return true for .json file', () => {
    expect(invertedIndexTrue.checkIfJson('example.json')).toEqual(true);
    });

    it('should return false for .txt file', () => {
    expect(invertedIndexTrue.checkIfJson('example.txt')).toEqual(false);
    });
  });

  describe('InvertedIndex: checks if file is empty', () => {
    const returnedObject = InvertedIndexEmpty.getTitlesAndTexts();
    let testValue = false;
    if ((returnedObject[0].titles[0] === "") || (returnedObject[0].texts[0 ] === "")) {
      testValue = true;
    }

    it('should return true for empty file', () => {
    expect(testValue).toEqual(true);
    });
  });

  describe('InvertedIndex: checks validity of file', () => {
    it('should return true for files containing titles and text', () => {
    expect(invertedIndexTrue.containsTitleText()).toEqual(true);
    });

    it('should return false for files containing titles and text', () => {
    expect(invertedIndexFalse.containsTitleText()).toEqual(false);
    });
  });

  describe('InvertedIndex: gets titles and text of file', () => {
    const returnedObject = invertedIndexTrue.getTitlesAndTexts();

    it('should return true if returned value is an Array', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });

    it('should return 2 for the length of returned value', () => {
    expect(returnedObject.length).toEqual(2);
    });
  });

  describe('InvertedIndex: gets indexed words', () => {
    const returnedObject = invertedIndexTrue.getIndexedWords();

    it('should return true if returned value is an Array', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('InvertedIndex: gets content to display', () => {
    const returnedObject = invertedIndexTrue.contentToDisplay();
    const bool = (returnedObject[0].length === returnedObject[1].length);

    it('should return true if the values at indexes are equal', () => {
    expect(bool).toEqual(true);
    });

    it('should return true is returned value is an Array', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('InvertedIndex: gets content to display in table format', () => {
    const returnedObject = invertedIndexTrue.displayInTableFormat();
    const bool = (returnedObject[0].length === returnedObject[1].length);

    it('should return true if the values at indexes are equal', () => {
    expect(bool).toEqual(true);
    });

    it('should return true is returned value is an Array', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });

  describe('InvertedIndex: search indexed words', () => {
    const returnedObject = invertedIndexTrue.searchIndexedWords(
      ['quick', 'An', 'unusual']);

    it('should return true is returned value is an Array', () => {
    expect(returnedObject instanceof Array).toBeTruthy();
    });
  });
});
