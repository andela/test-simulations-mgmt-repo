const books = require('../jasmine/assets/correct.json');
const wrongdata = require('../jasmine/assets/wrongFormat.json');
const emptyfile = require('../jasmine/assets/emptyfile.json');
const smallfile = require('../jasmine/assets/smallcorrectfile.json');
const uniqueTermsBook = require('../jasmine/assets/uniqueTermsBook.json');

describe('InvertedIndex Class', () => {
  beforeAll(() => {
    this.invertedIndex = new InvertedIndex();
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
    it('checks the tokenize function', () => {
      const input = 'jed is a boy'
      const output = ['jed', 'is', 'a', 'boy'];
      expect(this.invertedIndex.tokenize(input))
        .toEqual(output);
    });

    it('sanitizes the input in the tokenize function', () => {
      const input = 'tracy!!! is !@#$%^&*not -invited. &to my (wedding)'
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
    it('checks the uniqueWords function', () => {
      const input = ['aa', 'aa', 'aa'];
      const output = ['aa'];
      expect(this.invertedIndex.uniqueWords(input))
        .toEqual(output);
    });
  });

  describe('Validate Files ', () => {
    it('verifies that the JSON file is valid or invalid', () => {
      expect(this.invertedIndex.validateFile(books)
          .valid)
        .toBe(true);
      expect(this.invertedIndex.validateFile(smallfile)
          .valid)
        .toBe(true);
      expect(this.invertedIndex.validateFile(emptyfile)
          .valid)
        .toBe(false);
      expect(this.invertedIndex.validateFile(wrongdata)
          .valid)
        .toBe(false);
    });
  });

  describe('CreateIndex', () => {
    beforeAll(() => {
      this.invertedIndex.createIndex(smallfile, ['alice', 'falls'], 'smallcorrectfile.json');
      this.invertedIndex.createIndex(books, uniqueTermsBook, 'correct.json');
    });
    it('creates an index', () => {
      expect(this.invertedIndex.getIndex('correct.json'))
        .toBeTruthy();
      expect(this.invertedIndex.getIndex('smallcorrectfile.json'))
        .toBeTruthy();
    });
    it('creates the correct index', () => {
      expect(this.invertedIndex.getIndex('correct.json')
          .a)
        .toEqual([true, true, true, true]);
      expect(this.invertedIndex.getIndex('smallcorrectfile.json')
          .falls)
        .toEqual([true]);
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
    it('returns empty if element being searched for does not exist', () => {
      const keyword = 'alice';
      const indexedData = {
        dan: [false, false],
        brown: [false, false],
        john: [false, false],
        grisham: [false, false]
      };
      const output = {};
      expect(this.invertedIndex.searchIndex(keyword, indexedData))
        .toEqual(output);
    });

    it('returns the element being searched for', () => {
      const keyword = 'brown';
      const indexedData = {
        dan: [false, false],
        brown: [false, false],
        john: [false, false],
        grisham: [false, false]
      };
      const output = {
        brown: [false, false]
      };
      expect(this.invertedIndex.searchIndex(keyword, indexedData))
        .toEqual(output);
    });
  });

  describe('searchAllFiles', () => {
    beforeAll(() => {
      this.invertedIndex.createIndex(smallfile, ['alice', 'falls'], 'smallcorrectfile.json');
      this.invertedIndex.createIndex(books, uniqueTermsBook, 'correct.json');
    });
    it('returns an object containing all the indexed files', () => {
      expect(typeof this.invertedIndex.searchAllFiles())
        .toEqual('object');
    });
  });
});
