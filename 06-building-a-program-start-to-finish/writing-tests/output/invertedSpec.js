// book with valid contents
const validBook = require('./test/testFiles/validBook.json');
// book with invalid content
const invalidBook = require('./test/testFiles/invalidBook.json');
// empty book
const emptyBook = require('./test/testFiles/emptyBook.json');
// empty book
const malformedBook = require('./test/testFiles/malformedBook.json');
// book with few words
const smallValidBook = require('./test/testFiles/smallValidBook.json');
// Inverted Index class file
const InvertedIndex = require('../src/js/inverted-index.js').InvertedIndex;

const invertedIndex = new InvertedIndex();

describe('InvertedIndex class', () => {
  describe('Confirm class methods', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof invertedIndex.createIndex).toBe('function');
    });

    it('should check that the class has a readFile method', () => {
      expect(typeof InvertedIndex.readFile).toBe('function');
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
  describe('Validate File', () => {
    it('should check that the contents of the uploaded file is valid',
    () => {
      expect(InvertedIndex.validateFile(validBook)).toBeTruthy();
    });

    it('should return false for empty json files', () => {
      const successMsg = { status: false };

      expect(InvertedIndex.validateFile(emptyBook)).toEqual(successMsg);
    });

    it('should return true for files with property "title" and "text" ', () => {
      const successMsg = { status: true,
        jsonContent:
        [Object({ title: 'Alice in Wonderland',
          text: 'Alice falls into a rabbit hole.' }),
          Object({ title: 'The Lord of the Rings',
            text: 'An unusual alliance of man.' }),
          Object({ title: 'The Lord of the Rings:',
            text: 'An unusual alliance of man.' })
        ] };
      expect(InvertedIndex.validateFile(smallValidBook)).toEqual(successMsg);
    });

    it('should return false for files without "title" and "text" properties',
     () => {
       const msg = false;
       expect(InvertedIndex.validateFile(invalidBook)).toEqual(msg);
     });

    it('should return false if file is not an array of JSON object',
     () => {
       expect(InvertedIndex.validateFile(invalidBook)).toBeFalsy();
     });

    it('should return false if file contains an empty array',
     () => {
       const msg = { status: false };
       expect(InvertedIndex.validateFile(malformedBook)).toEqual(msg);
     });
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
      expect(invertedIndex.createIndex(smallValidBook,
        'smallValidBook.json')).toEqual(expectedResult);
    });
  });

  describe('Tokenize Words', () => {
    it('should strip out special characters from excerpt in documents', () => {
      let excerpt = 'Alice loves her ima&&gination';
      const expectedTokens = 'Alice loves her imagination';
      excerpt = InvertedIndex.tokenizeWords(excerpt);
      expect(expectedTokens).toEqual(excerpt);
    });
  });

  describe('Unique Words', () => {
    it('should ensure that a word is not repeated, for proper indexing', () => {
      let excerpt = ['alice', 'alice', 'be', 'called', 'loves', 'loves'];
      const expectedWords = ['alice', 'be', 'called', 'loves'];
      excerpt = InvertedIndex.uniqueWords(excerpt);
      expect(expectedWords).toEqual(excerpt);
    });
  });

  describe('splitAndSort Words', () => {
    it('should make all words lowercase, then it'
    + 'should ensure that sentences are splitted into an array of words,'
    + 'then sorted alphabetically to make searching more intuitive'
    + 'and make indexing more accurate', () => {
      let excerpt = 'The Lord of the Rings';
      const expectedResult = ['lord', 'of', 'rings', 'the'];
      excerpt = InvertedIndex.splitAndSort(excerpt);
      expect(expectedResult).toEqual(excerpt);
    });
  });

  describe('Get Index', () => {
    it('should verify that index has been created', () => {
      expect(Object.keys(invertedIndex.getIndex('smallValidBook.json')).length)
        .toBeGreaterThan(0);
    });
  });

  describe('Search index', () => {
    describe('Search index of words', () => {
      it('should return true if search term is a string', () => {
        const term = 'Wonderland of rings';
        expect(Object.keys(invertedIndex.searchIndex(term,
           'smallValidBook.json')))
        .toBeTruthy();
      });

      it('should return false if search term is not a string', () => {
        const term = [];
        expect(invertedIndex.searchIndex(term, 'smallValidBook.json'))
        .toBeFalsy();
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
        searchTerm = invertedIndex
          .searchIndex('Alice, and her unusual imagination',
        'smallValidBook.json');
        expect(Object.keys(searchTerm)).toEqual(Object.keys(requiredOutput));
        expect(searchTerm).toEqual(requiredOutput);
      });

      it('should search through all files that are indexed', () => {
        const output = {
          'smallValidBook.json':
          {
            alice: [0],
            and: [],
            her: [],
            imagination: [],
            unusual: [1, 2]
          }

        };
        let term = {};
        term = invertedIndex.searchIndex('Alice, and her unusual imagination',
        'All');
        expect(Object.keys(term)).toEqual(Object.keys(output));
        expect(term).toEqual(output);
      });
    });
  });
});
