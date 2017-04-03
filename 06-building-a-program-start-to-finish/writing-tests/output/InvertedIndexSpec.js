//  book with valid contents
const book = require('./allBooks/books.json');
const secondBook = require('./allBooks/newBook.json');
const myBook = require('./allBooks/myBook.json');
//  book with invalid content
const invalidFile = require('./allBooks/invalid.json');
//  empty book
const empty = require('./allBooks/empty.json');
// an array
const invalid = require('./allBooks/in-valid.json');
// empty array
const emptyFile = require('./allBooks/emptyArray.json');
// an invalid JSON file
const notValid = require('./allBooks/notArrayOfArray.json');

const meek = new InvertedIndex();

describe('Meek Inverted Index', () => {
  beforeAll(() => {
    meek.createIndex('book.json', book);
    meek.createIndex('secondBook.json', secondBook);
  });

  describe('The InvertedIndex class', () => {
    it('should be defined', () => {
      expect(InvertedIndex).toBeDefined();
    });

    it('should have  defined instance', () => {
      expect(meek).toBeDefined();
    });

    it('can create instances of inverted index class', () => {
      expect(meek instanceof InvertedIndex).toBeTruthy();
    });
  });

  describe('The InvertedIndex class', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof meek.createIndex).toBe('function');
    });

    it('should check that the class has a validateFile method', () => {
      expect(typeof InvertedIndex.validateFile).toBe('function');
    });

    it('should check that the class has a tokenize method', () => {
      expect(typeof InvertedIndex.tokenize).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof meek.getIndex).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof meek.searchIndex).toBe('function');
    });

    it('should check that the class has a setIndex method', () => {
      expect(typeof meek.setIndex).toBe('function');
    });
  });

  describe('The validateFile method', () => {
    it('should return true if file has property "title" and "text" ', () => {
      expect(InvertedIndex.validateFile(book)).toBeTruthy();
    });

    it('should return false if file does not have property "title" and "text"',
     () => {
       expect(InvertedIndex.validateFile(invalidFile)).toBeFalsy();
     });
    it('should check that the contents of the file to be uploaded is valid',
    () => {
      expect(InvertedIndex.validateFile(book)).toBeTruthy();
    });

    it('should return false for empty json files', () => {
      expect(InvertedIndex.validateFile(empty)).toBeFalsy();
    });

    it('should return false if file is not an array of JSON object',
     () => {
       expect(InvertedIndex.validateFile(invalid)).toBeFalsy();
     });

    it('should return false if file is an empty array',
     () => {
       expect(InvertedIndex.validateFile(emptyFile)).toBeFalsy();
     });

    it('should return false if file is a JSON file but not' +
    'an array of an array',
     () => {
       expect(InvertedIndex.validateFile(notValid)).toBeFalsy();
     });
  });

  describe('The createIndex method', () => {
    it('should return a response if index is created', () => {
      const response = 'Index created';
      expect(meek.createIndex('myBook.json', myBook)).toEqual(response);
    });

    it('should return a msg if index is not created', () => {
      const msg = 'Index not created';
      expect(meek.createIndex('notValid.json', notValid)).toEqual(msg);
    });
  });

  describe('The tokenize method', () => {
    it('should check that tokens are split and in sorted order', () => {
      let words = 'Hello Dear how are YOU';
      const expectedTokens = ['are', 'dear', 'hello', 'how', 'you'];
      words = InvertedIndex.tokenize(words);
      expect(expectedTokens).toEqual(words);
    });

    it('should strip out special characters', () => {
      let words = "I love Programming! @ gmail ) Mercy's  * &^%$#";
      const expectedTokens = ['gmail', 'i', 'love', 'mercy\'s', 'programming'];
      words = InvertedIndex.tokenize(words);
      expect(expectedTokens).toEqual(words);
    });
  });

  describe('The getIndex method', () => {
    it('should return an object', () => {
      expect(typeof meek.getIndex('book.json')).toEqual('object');
    });

    it(`should check that index maps the string to the correct objects in json
      array`, () => {
      const expectedIndex = {
        and: [0, 1],
        barbie: [1],
        cindarella: [1],
        cindy: [1],
        dearie: [0],
        going: [0],
        hello: [0],
        'how\'s': [0],
        i: [0, 1],
        it: [0],
        love: [0, 1],
        you: [0]
      };
      const result = meek.getIndex('secondBook.json');
      expect(result).toEqual(expectedIndex);
    });
  });

  describe('The searchIndex method', () => {
    it(`should search through indexed files and return expected
    result for a search`, () => {
      const texts = 'I love Barbie and Alice';
      const expectedResult = {
        'secondBook.json':
        {
          and: [0, 1],
          barbie: [1],
          i: [0, 1],
          love: [0, 1]
        }
      };
      expect((meek.searchIndex(texts, 'secondBook.json')))
      .toEqual(expectedResult);
    });

    it('should search through all files', () => {
      const result = {
        'book.json':
        {
          alice: [0],
          an: [1],
          and: [0, 1],
          barbie: [2],
          cartoons: [2],
          'fall\'s': [0],
          of: [0, 1],
          unusual: [1],
          wizard: [1]
        },
        'secondBook.json':
        {
          and: [0, 1],
          barbie: [1]
        },
        'myBook.json':
        {
          and: [0],
          'mercy\'s': [0],
          name: [0]
        }
      };
      const search = meek.searchIndex(`Barbie loves cartoons but she's
      scared of an unusual wizard, alice fall's and mercy's name`,
      'All files');
      expect(search).toEqual(result);
    });
  });
});
