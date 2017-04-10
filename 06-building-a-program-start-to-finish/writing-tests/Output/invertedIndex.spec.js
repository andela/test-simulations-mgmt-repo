/* global describe, it, expect, InvertedIndex */
const fantasyBook = require('./test books/fantasyBook.json');
const quotesAndRap = require('./test books/quotesAndRap.json');
const religiousBook = require('./test books/religiousBook.json');
const testsBook = require('./test books/testsBook.json');
const notArray = require('./test books/notArray.json');
const notArrayOfObjects = require('./test books/notArrayOfObjects.json');
const moreThanTwoKeys = require('./test books/moreThanTwoKeys.json');
const notAllTextKeys = require('./test books/notAllTextKeys.json');
const capitalTitleKey = require('./test books/capitalTitleKey.json');
const titleValueAsNumber = require('./test books/titleValueAsNumber.json');
const textValueAsNumber = require('./test books/textValueAsNumber.json');
const religiousBookIndexes = require('./test books/religiousBookIndexes.json');


const invertedIndex = new InvertedIndex();

describe('InvertedIndex', () => {
  describe('constructor', () => {
    it('should be an instance of  InvertedIndex', () => {
      expect(invertedIndex instanceof InvertedIndex).toBeTruthy();
      expect(typeof (invertedIndex)).toEqual('object');
    });

    it('should have defualt instatiated  values', () => {
      expect(invertedIndex.allIndexed).not.toBe(null);
      expect(invertedIndex.allTitles).not.toBe(null);
      expect(invertedIndex.documentsIndex).not.toBe(null);
      expect(invertedIndex.allIndexed).toEqual({});
      expect(invertedIndex.allTitles).toEqual({});
      expect(invertedIndex.documentsIndex).toEqual({});
      expect(invertedIndex.allIndexed).toBeDefined();
      expect(invertedIndex.allTitles).toBeDefined();
      expect(invertedIndex.documentsIndex).toBeDefined();
    });
  });

  describe('methods', () => {
    it('should be defined', () => {
      expect(InvertedIndex.readFile).not.toBeUndefined();
      expect(InvertedIndex.tokenize).not.toBeUndefined();
      expect(invertedIndex.createIndex).not.toBeUndefined();
      expect(invertedIndex.getIndex).not.toBeUndefined();
      expect(InvertedIndex.validateFile).not.toBeUndefined();
      expect(invertedIndex.searchIndex).not.toBeUndefined();
    });

    it('should be a function', () => {
      expect(typeof InvertedIndex.readFile).toBe('function');
      expect(typeof InvertedIndex.tokenize).toBe('function');
      expect(typeof invertedIndex.createIndex).toBe('function');
      expect(typeof invertedIndex.getIndex).toBe('function');
      expect(typeof InvertedIndex.validateFile).toBe('function');
      expect(typeof invertedIndex.searchIndex).toBe('function');
    });
  });


  describe('tokenize', () => {
    it('should eliminate special characters, symbols and white spaces', () => {
      const textString = 'why We\n so See\t two-timers#@!`~_+=/?"';

      const tokenizedTextString = ['why', 'we', 'so', 'see', 'two', 'timers'];
      expect(InvertedIndex.tokenize(textString)).toEqual(tokenizedTextString);
    });
  });

  describe('createIndex', () => {
    it('should create indices properly', () => {
      expect(invertedIndex.createIndex(religiousBook, 'religiousBook.json'))
        .toEqual(religiousBookIndexes);
    });
  });

  describe('getIndex', () => {
    it('should get indices from already created ones', () => {
      invertedIndex.createIndex(religiousBook, 'religiousBook.json');
      expect(invertedIndex.getIndex('religiousBook.json'))
        .toEqual(religiousBookIndexes);
    });

    it('should be false if file is not yet indexed', () => {
      expect(invertedIndex.getIndex(testsBook, 'testsBook.json'))
        .toEqual(false);
    });
  });

  describe('validateFile', () => {
    it('should be false if file is not an array', () => {
      expect(InvertedIndex.validateFile(notArray, 'notArray.json'))
        .toBeFalsy();
    });

    it('should be false if file is not an array of objects', () => {
      expect(InvertedIndex.validateFile(
        notArrayOfObjects, 'notArrayOfObjects.json')).toBeFalsy();
    });

    it('should be false if file does not contain only "text" and "title" keys',
    () => {
      expect(InvertedIndex.validateFile(
        moreThanTwoKeys, 'moreThanTwoKeys.json')).toBeFalsy();

      expect(InvertedIndex.validateFile(
        notAllTextKeys, 'notAllTextKeys.json')).toBeFalsy();

      expect(InvertedIndex.validateFile(
        capitalTitleKey, 'capitalTitleKey.json')).toBeFalsy();
    });

    it('should be false if file "text" and "title" values are not Strings',
    () => {
      expect(InvertedIndex.validateFile(titleValueAsNumber,
        'titleValueAsNumber.json')).toBeFalsy();

      expect(InvertedIndex.validateFile(textValueAsNumber,
        'textValueAsNumber.json')).toBeFalsy();
    });

    it('should be true if files are formatted properly', () => {
      expect(InvertedIndex.validateFile(fantasyBook, 'fantasyBook.json'))
        .toBeTruthy();
      expect(InvertedIndex.validateFile(quotesAndRap, 'quotesAndRap.json'))
        .toBeTruthy();
    });
  });

  describe('searchIndex', () => {
    it('should be able to get indices from already indexed files', () => {
      invertedIndex.createIndex(testsBook, 'testsBook.json');

      expect((invertedIndex.searchIndex('and', 'testsBook.json'))[0]
        .indexes.and).toEqual([1]);
      expect((invertedIndex.searchIndex('the', 'religiousBook.json'))[0]
        .indexes.the).toEqual([0, 1]);
    });

    it('should be false if empty string is searched for', () => {
      expect(invertedIndex.searchIndex(' ', 'religiousBook.json')).toBe(false);
    });

    it('should be able to search for multiple words in one file', () => {
      invertedIndex.createIndex(fantasyBook, 'fantasyBook.json');

      expect((invertedIndex.searchIndex(
        'and,the,that', 'fantasyBook.json'))[0].indexes)
          .toEqual({ and: [0, 1], the: [0, 1, 2], that: [2] });
    });

    it('should be able to search for multiple words in multiple files', () => {
      invertedIndex.createIndex(quotesAndRap, 'quotesAndRap.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].indexes)
        .toEqual({ the: [0, 1, 2], that: [2], in: [0, 2] });

      expect((invertedIndex.searchIndex('the, that,in', 'All'))[2].searchedFile)
        .toEqual('fantasyBook.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].title)
        .toEqual(["The 'Alice' in Wonderland",
          'The Lord of the Rings: The Fellowship of the Ring.',
          'The Tower of Babel: Ancient History.']);

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].indexes)
        .toEqual({ the: [2], that: [0, 1, 2], in: undefined });

      expect((invertedIndex.searchIndex('the, that,in', 'All'))[3].searchedFile)
        .toEqual('quotesAndRap.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].title)
        .toEqual(['Trial and Error', 'Sound of Music.', 'Pfunky']);
    });
  });
});
