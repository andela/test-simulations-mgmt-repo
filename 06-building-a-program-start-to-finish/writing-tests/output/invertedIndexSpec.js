const uniqueTermsBook = ['alice', 'falls', 'into', 'a', 'rabbit'];
const books = require('../assets/books.json');
const wrongdata = require('../assets/wrongdata.json');
const emptyfile = require('../assets/emptyfile.json');
const smallfile = require('../assets/smallfile.json');

describe('InvertedIndex Class', () => {
  beforeAll(() => {
    this.invertedIndex = new InvertedIndex();
  });

  describe('Class instantaion', () => {
    it('should be instantiated with the "new" keyword', () => {
      const init = () => {
        InvertedIndex();
      };
      expect(init).toThrowError
      (`Class constructor InvertedIndex cannot be invoked without 'new'`);
    });
  });

  describe('InvertedIndex class', () => {
    it('Should contain the getIndex method', () => {
      expect(typeof this.invertedIndex.tokenize).toBe('function');
    });

    it('Should contain the createIndex method', () => {
      expect(typeof this.invertedIndex.uniqueWords).toBe('function');
    });

    it('Should contain the searchIndex method', () => {
      expect(typeof this.invertedIndex.getTextFromJsonObj).toBe('function');
    });

    it('Should contain the readFile method', () => {
      expect(typeof this.invertedIndex.validateFile).toBe('function');
    });

    it('Should contain the tokenize method', () => {
      expect(typeof this.invertedIndex.createIndex).toBe('function');
    });

    it('Should contain the validateFile method', () => {
      expect(typeof this.invertedIndex.getIndex).toBe('function');
    });

    it('Should contain the validateFile method', () => {
      expect(typeof this.invertedIndex.searchIndex).toBe('function');
    });
  });

  describe('Constructor', () => {
    it('can create inverted index instance', () => {
      expect(typeof this.invertedIndex)
        .toEqual('object');
      expect(this.invertedIndex instanceof InvertedIndex)
        .toBe(true);
    });

    it('has an indexes object to hold all indexes', () => {
      expect(typeof this.invertedIndex.tableObj)
        .toEqual('object');
    });
  });

  describe('tokenize', () => {
    it('should return an array of words', () => {
      const input = 'jed is a boy';
      const output = ['jed', 'is', 'a', 'boy'];
      expect(this.invertedIndex.tokenize(input))
        .toEqual(output);
    });

    it('sanitizes the input in the tokenize function', () => {
      const input = 'tracy!!! is !@#$%^&*not -invited. &to my (wedding)';
      const output = ['tracy', 'is', 'not', 'invited', 'to', 'my', 'wedding'];
      expect(this.invertedIndex.tokenize(input))
        .toEqual(output);
    });
  });

  describe('getTextFromJsonObj', () => {
    it('should return an array of words', () => {
      expect(this.invertedIndex.getTextFromJsonObj(smallfile))
        .toEqual(['alice', 'falls', 'into', 'a', 'rabbit']);
    });

    it('filters out symbols', () => {
      expect(this.invertedIndex.getTextFromJsonObj(smallfile))
        .toEqual(['alice', 'falls', 'into', 'a', 'rabbit']);
    });
  });

  describe('uniqueWords', () => {
    it('should return an array of unique words', () => {
      const input = ['aa', 'aa', 'aa'];
      const output = ['aa'];
      expect(this.invertedIndex.uniqueWords(input))
        .toEqual(output);
    });
  });

  describe('Validate Files ', () => {
    it('should return true if a valid file was uploaded', () => {
      expect(this.invertedIndex.validateFile(books)
          .valid)
        .toBe(true);
      expect(this.invertedIndex.validateFile(smallfile)
          .valid)
        .toBe(true);
    });
    it('should return false if an invalid file was uploaded', () => {
      expect(this.invertedIndex.validateFile(emptyfile)
          .valid)
        .toBe(false);
      expect(this.invertedIndex.validateFile(wrongdata)
          .valid)
        .toBe(false);
    });
  });

  describe('CreateIndex', () => {
    it('creates an index', () => {
      expect(this.invertedIndex.createIndex(books, uniqueTermsBook, 'correct.json'))
        .toBeTruthy();
      expect(this.invertedIndex.createIndex(smallfile, uniqueTermsBook, 'smallcorrectfile.json'))
        .toBeTruthy();
    });
    it('creates the correct index', () => {
      expect(this.invertedIndex.createIndex(smallfile, uniqueTermsBook, 'smallcorrectfile.json'))
        .toEqual({
          alice: [true],
          falls: [true],
          into: [true],
          a: [true],
          rabbit: [true]
        });
    });
  });

  describe('GetIndex', () => {
    it('should return "undefined" if index does not exist', () => {
      expect(this.invertedIndex.getIndex(' '))
        .toEqual(undefined);
      expect(this.invertedIndex.getIndex('fakeName'))
        .toEqual(undefined);
    });
    it('returns the exact result of the index', () => {
      this.invertedIndex.createIndex(smallfile, ['alice', 'falls', 'into', 'a', 'rabbit'], 'smallcorrectfile.json');
      expect(this.invertedIndex.getIndex('smallcorrectfile.json'))
        .toEqual({
          a: [true],
          alice: [true],
          falls: [true],
          into: [true],
          rabbit: [true]
        });
    });
  });

  describe('searchIndex', () => {
    beforeAll(() => {
      this.invertedIndex.createIndex(smallfile, ['alice', 'falls'], 'smallcorrectfile.json');
      this.invertedIndex.createIndex(books, ['alice', 'falls'], 'correct.json');
    });
    it('returns empty if element being searched for does not exist', () => {
      const keyword = 'unqwerty';
      const fileName = 'smallcorrectfile.json';
      const output = {};
      expect(this.invertedIndex.searchIndex(keyword, fileName))
        .toEqual(output);
    });
    it('returns the element being searched for in a specific file', () => {
      const keyword = 'alice';
      const fileName = 'smallcorrectfile.json';
      const output = {
        alice: [true]
      };
      expect(this.invertedIndex.searchIndex(keyword, fileName))
        .toEqual(output);
    });
    it('returns the element being searched for in all files', () => {
      const keyword = 'alice';
      const fileName = 'all';
      const output = {
        'correct.json': {
          alice: [true, false, false, false]
        },
        'smallcorrectfile.json': {
          alice: [true]
        }
      };
      expect(this.invertedIndex.searchIndex(keyword, fileName))
        .toEqual(output);
    });
  });
});
