/* eslint-disable no-undef */

const data = require('./data');
const books = require('./books');
const invalid = require('./invalid');
const invalidContent = require('./invalidContent');

const inverted = new InvertedIndex();

describe('Inverted Index Test', () => {
  describe('Validations', () => {
    it('should return false if the JSON file is not valid', () => {
      const validation = InvertedIndexUtility.isValidJson(invalid);
      expect(validation).toBe(false);
    });
    it('should return false for invalid content', () => {
      const validation = InvertedIndexUtility.isValidContent(invalidContent);
      expect(validation).not.toBe(true);
    });
    it('should return false for an empty array', () => {
      const validation = InvertedIndexUtility.isValidContent([]);
      expect(validation).toBeFalsy();
    });
    it('should return true for a valid JSON file format', () => {
      const validation = InvertedIndexUtility.isValidContent(data);
      expect(validation).toBe(true);
    });
  });

  describe('Get Index', () => {
    it('should return false if index has not been created', () => {
      const actual = inverted.getIndex('books.json');
      expect(actual).toBe(false);
    });
  });

  describe('Create Index', () => {
    it('should return the index of the file', () => {
      inverted.createIndex('data.json', data);
      const indexCreated = inverted.getIndex('data.json').index;
      const indexExpected = [
        ['alice', true, false],
        ['again', true, false],
        ['harry', false, true],
        ['lost', true, true],
        ['is', true, true],
        ['magic', false, true],
        ['wand', false, true]
      ];
      expect(indexCreated).toEqual(indexExpected);
    });
  });

  describe('Search Index', () => {
    it('should return an empty array if no match is found', () => {
      const query = 'you can\'t find me';
      inverted.createIndex('data.json', data);
      const actual = inverted.searchIndex(query, 'data.json').index;
      const expected = [];
      expect(actual).toEqual(expected);
    });
    it('should return the result if a query is found', () => {
      const query = 'harry lost is magic';
      inverted.createIndex('data.json', data);
      const actual = inverted.searchIndex(query, 'data.json').index;
      const expected = [
        ['harry', false, true],
        ['lost', true, true],
        ['is', true, true],
        ['magic', false, true]
      ];
      expect(actual).toEqual(expected);
    });
    it('should get search result for all files indexded', () => {
      const query = 'alice is lost in the ring';
      inverted.createIndex('data.json', data);
      inverted.createIndex('books.json', books);
      const actual = inverted.searchIndex(query, 'All').index;
      const expected = [
        [['alice', true, false], ['is', true, true], ['lost', true, true]],
        [['alice', true, false], ['ring', false, true]]
      ];
      expect(actual).toEqual(expected);
    });
  });
});

describe('Testing Helper Methods', () => {
  describe('Get All words', () => {
    it('should return an array of all the words in the file', () => {
      const actual = InvertedIndexUtility.getAllWords(data);
      const expected = ['alice', 'again', 'harry', 'lost',
        'is', 'magic', 'wand'];
      expect(actual).toEqual(expected);
    });
  });
  describe('Get All words in each Book method', () => {
    it('should return an array of arrays that contains all words in each book',
     () => {
       const actual = InvertedIndexUtility.getAllWordsInEachBook(data);
       const expected = [['alice', 'is', 'lost', 'again'],
        ['harry', 'lost', 'is', 'magic', 'wand']];
       expect(actual).toEqual(expected);
     });
  });
  describe('Get Titles of each book', () => {
    it('should return an array that consists of all the title of each book',
     () => {
       const actual = InvertedIndexUtility.getTitlesOfEachBook(data);
       const expected = ['Alice in Wonderland', 'Harry Potter'];
       expect(actual).toEqual(expected);
     });
  });
  describe('Remove Duplicate words', () => {
    it('Should remove all duplicate words in an array', () => {
      const input = ['alice', 'is', 'alice', 'lord', 'word', 'word'];
      const actual = InvertedIndexUtility.removeDuplicateWords(input);
      const expected = ['is', 'alice', 'lord', 'word'];
      expect(actual).toEqual(expected);
    });
  });
  describe('Tokenize', () => {
    it('should return an array of Tokens', () => {
      const input = 'Hello there! How are you doing 2nite...';
      const actual = InvertedIndexUtility.tokenize(input);
      const expected = ['hello', 'there', 'how', 'are', 'you', 'doing', 'nite'];
      expect(actual).toEqual(expected);
    });
  });
  describe('Sanitize Query', () => {
    it('should return an array of the sanitized query', () => {
      const input = '  Hello-there! How are you you 2day...   ';
      const actual = InvertedIndexUtility.sanitizeQuery(input);
      const expected = ['hello', 'there', 'how', 'are', 'you', 'day'];
      expect(actual).toEqual(expected);
    });
  });
  describe('Get Selected Index', () => {
    it('should return the index of the given filename', () => {
      const fileNames = ['data.json', 'book.json', 'folder.json'];
      const actual = InvertedIndexUtility
      .getSelectedIndex(fileNames, 'data.json');
      const expected = 0;
      expect(actual).toBe(expected);
    });
    it('should return the index of the item if item in the array', () => {
      const fileNames = ['book1.json', 'book2.json', 'book3.json'];
      const actual = InvertedIndexUtility
      .getSelectedIndex(fileNames, 'book3.json');
      const expected = 2;
      expect(actual).toBe(expected);
    });
  });
  describe('Check occurence of words', () => {
    it('should return an array of the occurence of words in each book', () => {
      const words = ['alice', 'lord', 'wonderland', 'ring', 'in'];
      const wordsInEachBook = [['alice', 'in', 'ring'], ['lord', 'in', 'ring']];
      const actual = InvertedIndexUtility
      .checkOccurenceOfWords(words, wordsInEachBook);
      const expected = [true, false, false, true, false,
        false, true, true, true, true];
      expect(actual).toEqual(expected);
    });
  });
  describe('Get Word Occurence For Each Book', () => {
    it('should return an array that contains the words occurence in each book',
     () => {
       const input = [true, false, false, true, true, false];
       const bookCount = 3;
       const actual = InvertedIndexUtility
       .getWordOccurenceForEachBook(input, bookCount);
       const expected = [[true, false, false], [true, true, false]];
       expect(actual).toEqual(expected);
     });
    it('should split the array into three sub-arrays for a book count of two',
    () => {
      const input = [true, false, false, true, true, false];
      const bookCount = 3;
      const actual = InvertedIndexUtility
      .getWordOccurenceForEachBook(input, bookCount);
      const expected = [[true, false, false], [true, true, false]];
      expect(actual).toEqual(expected);
    });
  });
  describe('Map word with occurence', () => {
    it('should return an array that consist of word mapped with occurence',
     () => {
       const words = ['alice', 'in', 'wonderland'];
       const wordsOccurence = [[true, false], [false, true], [true, false]];
       const actual = InvertedIndexUtility
       .mapWordsWithOccurence(words, wordsOccurence);
       const expected = [['alice', true, false], ['in', false, true],
        ['wonderland', true, false]];
       expect(actual).toEqual(expected);
     });
  });
  describe('Construct Index', () => {
    it('should construct the index of the file', () => {
      const words = ['alice', 'in', 'wonderland'];
      const wordsInEachBook = [['alice', 'in', 'ring'], ['lord', 'in', 'ring']];
      const titles = ['Alice in Wonderland', 'Harry Potter'];
      const actual = InvertedIndexUtility
      .constructIndex(words, wordsInEachBook, titles);
      const expected = [['alice', true, false], ['in', true, true],
      ['wonderland', false, false]];
      expect(actual).toEqual(expected);
    });
  });
});
