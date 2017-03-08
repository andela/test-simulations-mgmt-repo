const books = require('./books.json');
const bios = require('./bios.json');
const stories = require('./stories.json');
const wrongdata = require('./wrongdata.json');
const emptyfile = require('./emptyfile.json');
const wrongfile = require('./wrongfile.js');

describe('InvertedIndex Class', () => {
  beforeAll(() => {
    this.invertedIndex = new InvertedIndex();
  });

  describe('Constructor', () => {
    it('can create inverted index instance', () => {
      expect(typeof this.invertedIndex).toEqual('object');
      expect(this.invertedIndex instanceof InvertedIndex).toBe(true);
    });

    it('has an indexes object to hold all indexes', () => {
      expect(typeof this.invertedIndex.indexes).toEqual('object');
    });
  });

  describe('GetWords', () => {
    it('should return an array of words', () => {
      expect(InvertedIndex.getWords(books[0].title))
        .toEqual(['alice', 'in', 'wonderland']);
    });

    it('filters out symbols', () => {
      expect(InvertedIndex.getWords('alice # in* Won@derland'))
        .toEqual(['alice', 'in', 'wonderland']);
    });
  });

  describe('Validate Files ', () => {
    it('ensures that the file content is a JSON array', () => {
      expect(Array.isArray(books)).toBeTruthy();
    });
    it('verifies that the JSON file is valid', () => {
      expect(InvertedIndex.validate(books)).toBe(true);
      expect(InvertedIndex.validate(wrongfile)).toBe(false);
      expect(InvertedIndex.validate(emptyfile)).toBe(false);
      expect(InvertedIndex.validate(wrongdata)).toBe(false);
    });
  });

  describe('CreateIndex', () => {
    beforeAll(() => {
      this.invertedIndex.createIndex('books', books);
      this.invertedIndex.createIndex('bios', bios);
    });
    it('creates an index', () => {
      expect(this.invertedIndex.getIndex('books')).toBeTruthy();
      expect(this.invertedIndex.getIndex('bios')).toBeTruthy();
    });
    it('creates the correct index', () => {
      expect(this.invertedIndex.getIndex('books').words.a).toEqual([0, 1, 2]);
      expect(this.invertedIndex.getIndex('books').words.alice).toEqual([0]);
      expect(this.invertedIndex.getIndex('bios').words.brushing).toEqual([1]);
      expect(this.invertedIndex.getIndex('bios').words.room).toEqual([0]);
    });
    it('saves document length', () => {
      expect(this.invertedIndex.getIndex('books').docCount).toEqual(3);
      expect(this.invertedIndex.getIndex('bios').docCount).toEqual(2);
    });
  });

  describe('GetIndex', () => {
    it('should return "undefined" if index does not exist', () => {
      expect(this.invertedIndex.getIndex(' ')).toEqual(undefined);
      expect(this.invertedIndex.getIndex('books4')).toEqual(undefined);
    });
    it('returns the exact result of the index', () => {
      this.invertedIndex.createIndex('stories', stories);
      expect(this.invertedIndex.getIndex('stories')).toEqual({
        words: {
          by: [0, 1],
          malcolm: [0, 1],
          gladwell: [0, 1],
          sequel: [1],
          to: [1],
          outliers: [1]
        },
        docCount: 2
      });
    });
  });

  describe('SearchIndex', () => {
    it('should return "not exist" if index does not exist', () => {
      expect(this.invertedIndex.searchIndex('alice in wonderland', 'movies'))
        .toEqual('Index with movies does not exist.');
    });

    it('should return "{}" for words not in index', () => {
      expect(this.invertedIndex.searchIndex('', 'books').words)
        .toEqual({});
    });

    it('should return object with search words', () => {
      expect(this.invertedIndex.searchIndex('alice unusual', 'books'))
      .toEqual({
        words: {
          alice: [0],
          unusual: [1, 2]
        },
        docCount: 3
      });
      expect(this.invertedIndex.searchIndex('room', 'bios'))
      .toEqual({
        words: {
          room: [0]
        },
        docCount: 2
      });
      expect(this.invertedIndex.searchIndex('brushing', 'bios'))
      .toEqual({
        words: {
          brushing: [1]
        },
        docCount: 2
      });
    });
  });

  describe('Search All Indexes', () => {
    it('should return object with search words', () => {
      expect(this.invertedIndex.searchAllIndexes('alice unusual outliers gladwell'))
      .toEqual({
        books: {
          words: {
            alice: [0],
            unusual: [1, 2]
          },
          docCount: 3
        },
        bios: {
          words: {},
          docCount: 2
        },
        stories: {
          words: {
            outliers: [1],
            gladwell: [0, 1]
          },
          docCount: 2
        },
      });
    });
  });
});
