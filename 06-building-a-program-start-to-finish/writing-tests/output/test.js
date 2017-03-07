const invertedIndex = require('../src/inverted-index.js');
const books = require('./books');

describe('Inverted index Suite', () => {
   // Create an instance of the Index class
  const newIndex = new invertedIndex();
  const sampleSentence = 'As &you can see here, you, have defined the function';
  beforeAll(() => {
    newIndex.createIndex('books', books);
  });

  describe('Class Inverted Index', () => {
    it('should be a class', () => {
      expect(newIndex instanceof Object).toBe(true);
      expect(newIndex instanceof invertedIndex).toBe(true);
      expect(typeof newIndex).toBe('object');
    });
  });

  describe('Tokenize String', () => {
    it('should be available in class InvertedIndex', () => {
      expect(invertedIndex.tokenize).toBeDefined();
    });
    it('should return an array containing alphabets only', () => {
      expect(invertedIndex.tokenize(sampleSentence)).toMatch(/[A-z]+$/);
    });
    it('should return an array containing alphabets only', () => {
      expect(invertedIndex.tokenize(sampleSentence)).not.toMatch(/&/);
    });
    it('should return an array containing alphabets only', () => {
      expect(invertedIndex.tokenize(sampleSentence)).toEqual(['as',
        'can', 'defined', 'function', 'have', 'here', 'see', 'the',
        'you', 'you']);
    });
    it('should return an array containing the correct number of words', () => {
      expect(invertedIndex.tokenize(sampleSentence).length).toBe(10);
    });
  });

  describe('Unique Words', () => {
    it('should be available in class InvertedIndex', () => {
      expect(invertedIndex.uniqueWords).toBeDefined();
    });
    it('should return an array of words without duplicates', () => {
      expect(invertedIndex.uniqueWords(sampleSentence).length).toBe(9);
    });
    it('should return an array of words without duplicates', () => {
      expect(invertedIndex.uniqueWords(sampleSentence)).toEqual(['as',
        'can', 'defined', 'function', 'have', 'here', 'see', 'the',
        'you']);
    });
  });

  describe('Populate Index', () => {
    it('should have an Index created', () => {
      expect(newIndex.index.books).toBeDefined();
    });
    it('should accurately map words to their document location', () => {
      expect(newIndex.index.books.heroku).toEqual([0]);
      expect(newIndex.index.books.your).toEqual([0, 1]);
    });
  });

  describe('Get Index', () => {
    it('should map words to the correct document location', () => {
      const indexnew = (newIndex.getIndex('books'));
      expect(indexnew).toEqual({ a: [0, 1],
        address: [0],
        after: [0],
        all: [1],
        an: [0, 1],
        and: [0, 1],
        api: [0],
        asked: [0],
        be: [0],
        code: [1],
        command: [0],
        coverage: [1],
        covered: [1],
        credentials: [0],
        email: [0],
        enter: [0],
        first: [0],
        heroku: [0],
        including: [1],
        latest: [1],
        lines: [1],
        of: [1],
        on: [1],
        percentages: [1],
        repositories: [1],
        run: [0],
        saved: [0],
        see: [1],
        statistics: [1],
        the: [0, 1],
        time: [0],
        to: [0, 1],
        token: [0],
        total: [1],
        will: [0],
        you: [0, 1],
        your: [0, 1] });
    });
    it('should return undefined if no index has been created', () => {
      const getIndex = newIndex.getIndex('book3');
      expect(getIndex).toBeUndefined();
    });
  });

  describe('Search index', () => {
    it('should have searchIndex method accessible in the class', () => {
      expect(newIndex.searchIndex).toBeDefined();
    });
    it('should return no query when no value is passed in', () => {
      expect(newIndex.searchIndex()).toEqual('no query to search');
    });
    it('should return an empty {object} if no query is found', () => {
      expect(typeof newIndex
      .searchIndex('Checkpoint', 'books')).toEqual('object');
      expect(Object.keys(newIndex
       .searchIndex('Checkpoint', 'books')).length).toBe(0);
    });

    it('should return an {object} with valid properties', () => {
      const searchResult = newIndex.searchIndex('you will be asked', 'books');
      expect(typeof (searchResult) === 'object').toBe(true);
      expect(searchResult.you).toEqual(jasmine.arrayContaining([1]));
    });
    it('should return object(s) with keys index', () => {
      const result = newIndex.searchIndex('the statistics', 'books');
      const expectedResult = { statistics: [1], the: [0, 1] };
      expect(result).toEqual(expectedResult);
    });
  });
});
