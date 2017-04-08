const validBook = require('./test/testFiles/validBook.json');
const validBook2 = require('./test/testFiles/validBook2.json');
const invalidBook = require('./test/testFiles/invalidBook.json');
const emptyBook = require('./test/testFiles/emptyBook.json');
const malformedBook = require('./test/testFiles/malformedBook.json');
const smallValidBook = require('./test/testFiles/smallValidBook.json');
const InvertedIndex = require('../src/js/InvertedIndex.js').InvertedIndex;

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

    it('should check that the class has a tokenizeText method', () => {
      expect(typeof InvertedIndex.tokenizeText).toBe('function');
    });

    it('should check that the class has a removeBadCharacters method', () => {
      expect(typeof InvertedIndex.removeBadCharacters).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof InvertedIndex.concatenateText).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof invertedIndex.searchIndex).toBe('function');
    });
  });

  describe('The validateFile method', () => {
    it('should check that the contents of the uploaded file is valid',
    () => {
      const msg = { status: true,
        jsonContent:
        [{ title: 'Alice in Wonderland',
          text: 'Alice falls into a rabbit hole and enters a world '
          + 'full of imagination.' },
        { title: 'The Lord of the Rings: The Fellowship of the Ring.',
          text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit '
          + 'seek to destroy a powerful ring.' },
        { title: 'The Lord of the Rings: The Fellowship of.',
          text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit '
          + 'seek to destroy a powerful ring.' }] };
      expect(InvertedIndex.validateFile(validBook)).toEqual(msg);
    });

    it('should return false for empty json files', () => {
      const successMsg = { status: false };

      expect(InvertedIndex.validateFile(emptyBook)).toEqual(successMsg);
    });

    it('should return true for files with property "title" and "text" ', () => {
      const successMsg = { status: true,
        jsonContent:
        [
          {
            title: 'Alice in Wonderland',
            text: 'Alice falls into a rabbit hole.'
          },

          {
            title: 'The Lord of the Rings',
            text: 'An unusual alliance of man.'
          },
          {
            title: 'The Lords of the Rings',
            text: 'An unusual alliance of man.'
          }
        ]
      };
      expect(InvertedIndex.validateFile(smallValidBook)).toEqual(successMsg);
    });

    it('should return false for files without "title" and "text" properties',
     () => {
       const msg = { status: false };
       expect(InvertedIndex.validateFile(invalidBook)).toEqual(msg);
     });

    it('should return false if file is not an array of JSON object',
     () => {
       const msg = { status: false };
       expect(InvertedIndex.validateFile(invalidBook)).toEqual(msg);
     });

    it('should return false if file contains an empty array',
     () => {
       const msg = { status: false };
       expect(InvertedIndex.validateFile(malformedBook)).toEqual(msg);
     });
  });

  describe('The createIndex method', () => {
    it('should return mapped indices to words in a JSON file', () => {
      invertedIndex.createIndex(validBook2, 'validBook2.json');
      invertedIndex.createIndex(smallValidBook, 'smallValidBook.json');
      const result =
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
          man: [1],
          of: [1, 2],
          rings: [1],
          the: [1, 2],
          unusual: [1, 2],
          lords: [2],
          rocks: [2] };
      expect(invertedIndex.getIndex('validBook2.json')).toEqual(result);
    });
  });

  describe('The removeBadCharacters method', () => {
    it('should strip out special characters from strings in documents', () => {
      let text = 'Alice loves her ima&&gination';
      const expectedString = 'Alice loves her imagination';
      text = InvertedIndex.removeBadCharacters(text);
      expect(expectedString).toEqual(text);
    });
  });

  describe('The readFile method', () => {
    it('should return true if content was read from a valid JSON file', () => {
      expect(InvertedIndex.readFile('smallValidBook.json'))
        .toBeTruthy();
    });
  });

  describe('The UniqueWords method', () => {
    it('should ensure that a word is not repeated, for proper indexing', () => {
      let excerpt = ['alice', 'alice', 'be', 'called', 'loves', 'loves'];
      const expectedWords = ['alice', 'be', 'called', 'loves'];
      excerpt = InvertedIndex.uniqueWords(excerpt);
      expect(expectedWords).toEqual(excerpt);
    });
  });

  describe('The tokenizeText method', () => {
    it('should make all words lowercase', () => {
      let words = 'THE LORD OF THE RINGS';
      const expectedResult = ['lord', 'of', 'rings', 'the'];
      words = InvertedIndex.tokenizeText(words);
      expect(expectedResult).toEqual(words);
    });

    it('should ensure that sentences are splitted into an array of words'
    , () => {
      let excerpt = 'Alice in Wonderland';
      const expectedResult = ['alice', 'in', 'wonderland'];
      excerpt = InvertedIndex.tokenizeText(excerpt);
      expect(expectedResult).toEqual(excerpt);
    });

    it('should sort words alphabetically', () => {
      let excerpt = 'The Rings of the Lords';
      const expectedResult = ['lords', 'of', 'rings', 'the'];
      excerpt = InvertedIndex.tokenizeText(excerpt);
      expect(expectedResult).toEqual(excerpt);
    });
  });

  describe('The getIndex method', () => {
    it('should verify that index has been created', () => {
      expect(Object.keys(invertedIndex.getIndex('smallValidBook.json')).length)
        .toBeGreaterThan(0);
    });
  });

  describe('The searchIndex method', () => {
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
        const output =
          { 'smallValidBook.json':
          { alice: [0],
            and: [],
            her: [],
            imagination: [],
            unusual: [1, 2] },
            'validBook2.json':
            { alice: [0],
              and: [],
              her: [],
              imagination: [],
              unusual: [1, 2]
            } };
        let term = {};
        term = invertedIndex.searchIndex('Alice, and her unusual imagination',
        'All');
        expect(Object.keys(term)).toEqual(Object.keys(output));
        expect(term).toEqual(output);
      });
    });
  });
});
