/* global describe, it, expect */
const fantasyBook = require('../../src/test books/fantasyBook.json'),
      quotesAndRap = require('../../src/test books/quotesAndRap.json'),
      religiousBook = require('../../src/test books/religiousBook.json'),
      testsBook = require('../../src/test books/testsBook.json'),
      notArray = require('../../src/test books/notArray.json'),
      notArrayOfObjects =
                      require('../../src/test books/notArrayOfObjects.json'),
      moreThanTwoKeys = require('../../src/test books/moreThanTwoKeys.json'),
      notAllTextKeys = require('../../src/test books/notAllTextKeys.json'),
      capitalTitleKey= require('../../src/test books/capitalTitleKey.json'),
      titleValueAsNumber =
                        require('../../src/test books/titleValueAsNumber.json'),
      textValueAsNumber =
                        require('../../src/test books/textValueAsNumber.json');
      religiousBookIndexes =
                      require('../../src/test books/religiousBookIndexes.json');


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

  describe('readFile', () => {
    it('should be defined', () => {
      expect(invertedIndex.readFile).not.toBeUndefined();
    });

    it('should be a function', () => {
      expect(typeof invertedIndex.readFile).toBe('function');      
    });
  });

  describe('tokenize', () => {
    it('should eliminate special characters, symbols and white spaces', () => {
      const textString = 'why are We\n so blind\t to see two-timers#@!`~_+=/?"';

      const tokenizedTextString = [ 'why', 'are', 'we', 'so', 'blind', 'to',
                                    'see', 'two', 'timers' ];
                                    
      expect(invertedIndex.tokenize).not.toBeUndefined();
      expect(typeof invertedIndex.tokenize).toBe('function');
      expect(invertedIndex.tokenize(textString)).toEqual(tokenizedTextString);
    });
  });

  describe('createIndex', () => {
    it('should create indices properly', () => {
      expect(invertedIndex.createIndex).not.toBeUndefined();
      expect(typeof invertedIndex.createIndex).toBe('function');
      expect(invertedIndex.createIndex(religiousBook, 'religiousBook.json'))
                                            .toEqual(religiousBookIndexes);
    });
  });

  describe('getIndex', () => {
    it('should get indices from already created ones', () => {
      invertedIndex.createIndex(religiousBook, 'religiousBook.json');
      expect(invertedIndex.getIndex).not.toBeUndefined();
      expect(typeof invertedIndex.getIndex).toBe('function');
      expect(invertedIndex.getIndex(religiousBook, 'religiousBook.json'))
                                              .toEqual(religiousBookIndexes);
    });

    it('should be false if file is not yet indexed', () => {
      expect(invertedIndex.getIndex(testsBook, 'testsBook.json'))
                                                                .toEqual(false);
    });
  });

  describe('validateFile', () => {
    it('should be defined and should be false if file is not an array', () => {
      expect(invertedIndex.validateFile).not.toBeUndefined();      
      expect(invertedIndex.validateFile(notArray, 'notArray.json'))
                                                                  .toBeFalsy();
    });

    it('should be false if file is not an array of objects', () => {
      expect(typeof invertedIndex.validateFile).toBe('function');      
      expect(invertedIndex.validateFile(notArrayOfObjects, 
                                        'notArrayOfObjects.json')).toBeFalsy();
    });

    it('should be false if file does not contain only "text" and "title" keys',
    () => {
      expect(invertedIndex.validateFile(moreThanTwoKeys,
                                        'moreThanTwoKeys.json')).toBeFalsy();

      expect(invertedIndex.validateFile(notAllTextKeys, 'notAllTextKeys.json'))
                                                                  .toBeFalsy();

      expect(invertedIndex.validateFile(capitalTitleKey,
                                          'capitalTitleKey.json')).toBeFalsy();
    });

    it('should be false if file "text" and "title" values are not Strings',
    () => {
      expect(invertedIndex.validateFile(titleValueAsNumber,
                                        'titleValueAsNumber.json')).toBeFalsy();

      expect(invertedIndex.validateFile(textValueAsNumber,
                                        'textValueAsNumber.json')).toBeFalsy();
    });

    it('should be true if files are formatted properly', () => {
      expect(invertedIndex.validateFile(fantasyBook, 'fantasyBook.json'))
                                                                  .toBeTruthy();
      expect(invertedIndex.validateFile(quotesAndRap, 'quotesAndRap.json'))
                                                                  .toBeTruthy();
    });
  });

  describe('searchIndex', () => {
    it('should be able to get indices from already indexed files', () => {
      invertedIndex.createIndex(testsBook, 'testsBook.json');

      expect(invertedIndex.searchIndex).not.toBeUndefined();
      expect(typeof invertedIndex.searchIndex).toBe('function');
      expect((invertedIndex.searchIndex('and', 'testsBook.json'))[0]
                                                    .indexes.and).toEqual([1]);
      expect((invertedIndex.searchIndex('the', 'religiousBook.json'))[0]
                                                .indexes.the).toEqual([ 0, 1 ]);
    });

    it('should be false if empty string is searched for', () => {
      expect(invertedIndex.searchIndex(' ', 'religiousBook.json')).toBe(false);
    });

    it('should be able to search for multiple words in one file', () => {
      invertedIndex.createIndex(fantasyBook, 'fantasyBook.json');

      expect((invertedIndex.searchIndex(
                      'and,the,that', 'fantasyBook.json'))[0].indexes)
                      .toEqual({and: [ 0, 1 ], the: [ 0, 1, 2 ], that: [ 2 ]});
    });

    it('should be able to search for multiple words in multiple files', () => {
      invertedIndex.createIndex(quotesAndRap, 'quotesAndRap.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].indexes)
                        .toEqual({the: [ 0, 1, 2 ], that: [ 2 ], in: [ 0, 2 ]});

      expect((invertedIndex.searchIndex('the, that,in', 'All'))[2].searchedFile)
                            .toEqual('fantasyBook.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].title)
                .toEqual(["The 'Alice' in Wonderland",
                          "The Lord of the Rings: The Fellowship of the Ring.",
                          "The Tower of Babel: Ancient History."]);

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].indexes)
                      .toEqual({the: [ 2 ], that: [ 0, 1, 2 ], in: undefined});  

      expect((invertedIndex.searchIndex('the, that,in', 'All'))[3].searchedFile)
                            .toEqual('quotesAndRap.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].title)
                    .toEqual(["Trial and Error", "Sound of Music.", "Pfunky"]);                                                
    });
  });
});