const validBook = require('./test/testFiles/validBook.json');  //  book with valid contents
const invalidBook = require('./test/testFiles/invalidBook.json'); //  book with invalid content
const emptyBook = require('./test/testFiles/emptyBook.json');   //  empty book
const malformedJSON = require('./test/testFiles/malformed.json'); // empty book
const smallBook = require('./test/testFiles/smallValidBook.json'); // book with few words
const InvertedIndex = require('../src/js/inverted.js').InvertedIndex; // Inverted Index class file

const invertedIndex = new InvertedIndex();

describe('InvertedIndex class', () => {
  describe('InvertedIndex class', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof invertedIndex.createIndex).toBe('function');
    });

    it('should check that the class has a readFile method', () => {
      expect(typeof invertedIndex.readFile).toBe('function');
    });

    it('should check that the class has a validateFile method', () => {
      expect(typeof InvertedIndex.validateFile).toBe('function');
    });

    it('should check that the class has a uniqueWords method', () => {
      expect(typeof InvertedIndex.uniqueWords).toBe('function');
    });

    it('should check that the class has a tokenizeWords method', () => {
      expect(typeof InvertedIndex.tokenizeWords).toBe('function');
    });

    it('should check that the class has a splitAndSort method', () => {
      expect(typeof InvertedIndex.splitAndSort).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof InvertedIndex.concatenateText).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof invertedIndex.searchIndex).toBe('function');
    });
  });

  it('should check that the contents of the uploaded file is valid',
    () => {
      expect(InvertedIndex.validateFile(validBook)).toBeTruthy();
    });

  it('should return false for empty json files', () => {
    expect(InvertedIndex.validateFile(emptyBook)).toBeFalsy();
  });

  it('should return true for uploaded files with property "title" and "text" ', () => {
    expect(InvertedIndex.validateFile(validBook)).toBeTruthy();
  });

  it('should return false for files without "title" and "text" properties',
     () => {
       expect(InvertedIndex.validateFile(invalidBook)).toBeFalsy();
     });

  it('should return false if file is not an array of JSON object',
     () => {
       expect(InvertedIndex.validateFile(invalidBook)).toBeFalsy();
     });

  it('should return false if file contains an empty array',
     () => {
       expect(InvertedIndex.validateFile(malformedJSON)).toBeFalsy();
     });

  describe('Create Index', () => {
    it('should return mapped indices to words in a JSON file', () => {
      const expectedResult =
        { 'smallValidBook.json':
        { a: [0],
          alice: [0],
          falls: [0],
          hole: [0],
          in: [0],
          into: [0],
          rabbit: [0],
          wonderland: [0],
          alliance: [1, 2],
          an: [1, 2],
          lord: [1, 2],
          man: [1, 2],
          of: [1, 2],
          rings: [1, 2],
          the: [1, 2],
          unusual: [1, 2] } };
      expect(invertedIndex.createIndex(smallBook, 'smallValidBook.json')).toEqual(expectedResult);
    });
  });

  describe('Tokenize words', () => {
    it('should strip out special characters from excerpt in documents', () => {
      let excerpt = 'Alice loves her ima&&gination';
      const expectedTokens = 'Alice loves her imagination';
      excerpt = InvertedIndex.tokenizeWords(excerpt);
      expect(expectedTokens).toEqual(excerpt);
    });
  });


  describe('Get Index', () => {
    it('should verify that index has been created', () => {
      expect(Object.keys(invertedIndex.getIndex('smallValidBook.json')).length)
        .toBeGreaterThan(0);
    });
  });

  describe('Search index', () => {
    it('should return true if search term is a string', () => {
      const term = 'Wonderland of rings';
      expect(Object.keys(invertedIndex.searchIndex(term, 'smallValidBook.json')))
      .toBeTruthy();
    });
  });

  it('should search through single files that are indexed', () => {
    const requiredOutput = {
      'smallValidBook.json':
      {
        alice: [0],
        and: [],
        her: [],
        imagination: [],
        unusual: [1, 2]
      }
    };
    let searchTerm = {};
    searchTerm = invertedIndex.searchIndex('Alice, and her unusual imagination',
      'smallValidBook.json');
    expect(Object.keys(searchTerm)).toEqual(Object.keys(requiredOutput['smallValidBook.json']));
    expect(searchTerm).toEqual(requiredOutput['smallValidBook.json']);
  });
});
