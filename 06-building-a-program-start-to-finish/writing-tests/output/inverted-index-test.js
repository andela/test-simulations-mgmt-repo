const books = require('./books.json');
const books2 = require('./books2.json');
const books3 = require('./books3.json');

describe('InvertedIndex Class', () => {
  beforeAll(() => {
    invertedIndex = new InvertedIndex();
  });

  describe('Constructor', () => {
    it('can create inverted index instance', () => {
      expect(typeof invertedIndex).toEqual('object');
      expect(invertedIndex instanceof InvertedIndex).toBe(true);
    });

    it('has an indexes object to hold all indexes', () => {
      expect(typeof invertedIndex.indexes).toEqual('object');
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

  describe('CreateIndex', () => {
    beforeAll(() => {
       invertedIndex.createIndex('books', books);
       invertedIndex.createIndex('books2', books2);
    });
    it('creates an index', () => {
      expect(invertedIndex.getIndex('books')).toBeTruthy();
      expect(invertedIndex.getIndex('books2')).toBeTruthy();
    });
    it('creates the correct index', () => {
      expect(invertedIndex.getIndex('books').words.a).toEqual([0, 1, 2]);
      expect(invertedIndex.getIndex('books').words.alice).toEqual([0]);
      expect(invertedIndex.getIndex('books2').words.brushing).toEqual([1]);
      expect(invertedIndex.getIndex('books2').words.room).toEqual([0]);
    });
    it('saves document length', () => {
      expect(invertedIndex.getIndex('books').docCount).toEqual(3);
      expect(invertedIndex.getIndex('books2').docCount).toEqual(2);
    });
  });

  describe('GetIndex', () => {
    it('should return "undefined" if index does not exist', () => {
      expect(invertedIndex.getIndex(' ')).toEqual(undefined);
      expect(invertedIndex.getIndex('books4')).toEqual(undefined);
    });
    it('returns the exact result of the index', () => {
      invertedIndex.createIndex('books3', books3);
      expect(invertedIndex.getIndex('books3')).toEqual({
        words:{
          'by':[0,1], 
          'malcolm':[0,1], 
          'gladwell':[0,1],
          'sequel':[1],
          'to':[1],
          'outliers':[1]
        },
        docCount: 2
      });
    });
  });

  describe('SearchIndex', () => {
    it('should return "not exist" if index does not exist', () => {
      expect(invertedIndex.searchIndex('alice in wonderland', 'movies'))
        .toEqual('Index with movies does not exist.');
    });

    it('should return "{}" for words not in index', () => {
      expect(invertedIndex.searchIndex('', 'books').words)
        .toEqual({});
    });

    it('should return object with search words', () => {
      expect(invertedIndex.searchIndex('alice unusual', 'books'))
      .toEqual({
        words: {
          'alice': [0], 
          'unusual': [1,2] 
        },
        docCount: 3
      });
      expect(invertedIndex.searchIndex('room', 'books2'))
      .toEqual({
        words: {
          'room': [0]
        },
        docCount: 2
      });
      expect(invertedIndex.searchIndex('brushing', 'books2'))
      .toEqual({
        words: {
        'brushing': [1]
        },
        docCount: 2
      });
    });
  });

  describe('Search All Indexes', () => {

    it('should return object with search words', () => {
      console.log(invertedIndex.searchAllIndexes('alice unusual outliers gladwell'))
      expect(invertedIndex.searchAllIndexes('alice unusual outliers gladwell'))
      .toEqual({
        books: {
          words: {
            'alice': [0], 
            'unusual': [1,2] 
          },
            docCount: 3
        },
        books2: {
          words: {},
          docCount: 2
        },
        books3: {
          words: {
            'outliers': [1], 
            'gladwell': [0,1] 
          },
            docCount: 2
        },
      });
    });
  });
});
