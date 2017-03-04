const InvertedIndex = require('../src/inverted-index.js');
const books = require('./books');

describe('Inverted index Suite', () => {
   // Create an instance of the Index class
  const newIndex = new InvertedIndex();
  const sampleSentence = 'As &you can see here, you, have defined the function';
  beforeAll(() => {
    newIndex.createIndex('books', books);
  });

  describe('Class Inverted Index', () => {
    it('should be a class', () => {
      expect(newIndex instanceof Object).toBe(true);
      expect(newIndex instanceof InvertedIndex).toBe(true);
      expect(typeof newIndex).toBe('object');
    });
  });

  describe('Tokenize String', () => {
    it('should be available in class InvertedIndex', () => {
      expect(InvertedIndex.tokenize).toBeDefined();
    });
    it('should return an array containing alphabets only', () => {
      expect(InvertedIndex.tokenize(sampleSentence)).toMatch(/[a-z]/);
    });
    it('should return an array containing alphabets only', () => {
      expect(InvertedIndex.tokenize(sampleSentence)).not.toMatch(/&/);
    });
    it('should return an array containing alphabets only', () => {
      expect(InvertedIndex.tokenize(sampleSentence)).toEqual(['as',
        'can', 'defined', 'function', 'have', 'here', 'see', 'the',
        'you', 'you']);
    });
    it('should return an array containing the correct number of words', () => {
      expect(InvertedIndex.tokenize(sampleSentence).length).toBe(10);
    });
  });

  describe('Unique Words', () => {
    it('should be available in class InvertedIndex', () => {
      expect(InvertedIndex.uniqueWords).toBeDefined();
    });
    it('should return an array of words without duplicates', () => {
      expect(InvertedIndex.uniqueWords(sampleSentence).length).toBe(9);
    });
    it('should return an array of words without duplicates', () => {
      expect(InvertedIndex.uniqueWords(sampleSentence)).toEqual(['as',
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
    it('should return an object of all created index', () => {
      const bookIndex = newIndex.index.books;
      const bookKeys = Object.keys(bookIndex);
      bookKeys.forEach((key) => {
        expect({}.hasOwnProperty.call(bookIndex, key)).toBeTruthy();
      });
    });

    describe('Get Index', () => {
      it('should return an accurate index Object of the indexed file', () => {
        expect(newIndex.getIndex('books')).toBeDefined();
        expect(Object.keys(newIndex.getIndex('books')).length).toBe(37);
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
    });
  });
});
