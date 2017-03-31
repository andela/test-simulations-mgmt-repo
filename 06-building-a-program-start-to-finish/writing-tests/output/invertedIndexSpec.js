const books = require('./books/books.json');
const shortStories = require('./books/shortStories.json');
const empty = require('./books/empty.json');
const missingText = require('./books/missingText.json');
const notArray = require('./books/notArray.json');
const wrongData = require('./books/wrongData.json');

const index = new InvertedIndex(['stories.json'],
  {
    'stories.json': {
      bookTitles: ['Alice', 'Rings'],
      allWords: ['alice', 'falls', 'into', 'an', 'unusual', 'alliance'],
      words: {
        alice: [true, false],
        falls: [true, true],
        into: [true, false],
        an: [false, true],
        unusual: [false, true],
        alliance: [false, true],
      },
      filename: 'stories.json'
    }
  }
);
const filename = 'shortStories.json';

describe('InvertedIndex:', () => {
  describe('Constructor', () => {
    it('can create an instance of InvertedIndex', () => {
      expect(typeof index).toEqual('object');
    });

    it('initializes properties correctly', () => {
      expect(index.filenames instanceof Object).toEqual(true);
      expect(typeof index.files).toEqual('object');
      expect(index.filenames).toEqual(['stories.json']);
    });
  });

  describe('ValidateFile', () => {
    it('should return false if an invalid file was uploaded', () => {
      expect(InvertedIndex.validateFile(empty)).toBe(false);
      expect(InvertedIndex.validateFile(missingText)).toBe(false);
      expect(InvertedIndex.validateFile(notArray)).toBe(false);
      expect(InvertedIndex.validateFile(wrongData)).toBe(false);
    });

    it('should return true if a valid file was uploaded', () => {
      expect(InvertedIndex.validateFile(books)).toBe(true);
      expect(InvertedIndex.validateFile(shortStories)).toBe(true);
    });
  });

  describe('Tokenize', () => {
    it('should return an array of unique words', () => {
      expect(InvertedIndex.tokenize('tony is humble tony'))
      .toEqual(['tony', 'is', 'humble']);
    });

    it('should remove invalid characters', () => {
      expect(InvertedIndex.tokenize('$A%^n*del)a %i=s @a$w&es$om#e%'))
      .toEqual(['andela', 'is', 'awesome']);
    });

    it('should return lowercase words', () => {
      expect(InvertedIndex.tokenize('HEllO WORLD')).toEqual(['hello', 'world']);
    });

    it('should remove numbers', () => {
      expect(InvertedIndex.tokenize('tru3e s7tor8y'))
      .toEqual(['true', 'story']);
    });
  });

  describe('GetIndex', () => {
    it('should return an object', () => {
      expect(typeof index.getIndex('stories.json')).toEqual('object');
    });

    it('should return the correct index object', () => {
      expect(index.getIndex('stories.json')).toEqual(
        {
          bookTitles: ['Alice', 'Rings'],
          allWords: ['alice', 'falls', 'into', 'an', 'unusual', 'alliance'],
          words: {
            alice: [true, false],
            falls: [true, true],
            into: [true, false],
            an: [false, true],
            unusual: [false, true],
            alliance: [false, true],
          },
          filename: 'stories.json'
        }
      );
    });

    it('should return false if file index was not found', () => {
      expect(index.getIndex('notIndex.json')).toBe(false);
    });
  });

  describe('CreateIndex', () => {
    it('returns true if file index was created successfully', () => {
      expect(index.createIndex(shortStories, filename)).toBe(true);
    });

    it('creates an index object', () => {
      expect(typeof index.getIndex(filename)).toEqual('object');
    });

    it('returns false if file already exists', () => {
      expect(index.createIndex(shortStories, filename)).toBe(false);
    });

    it('correctly stores the total number of books and their titles', () => {
      expect(index.getIndex(filename).bookTitles).toEqual(
        ['Alice', 'Lord of the Rings', 'Rings']
      );
      expect(index.getIndex(filename).bookTitles.length).toBe(3);
    });

    it('creates the correct index object', () => {
      expect(index.getIndex(filename)).toEqual(
        {
          bookTitles: ['Alice', 'Lord of the Rings', 'Rings'],
          allWords: ['alice', 'falls', 'into', 'an', 'unusual', 'alliance'],
          words: {
            alice: [true, false, false],
            falls: [true, true, false],
            into: [true, false, false],
            an: [false, true, true],
            unusual: [false, true, true],
            alliance: [false, true, true],
          },
          filename: 'shortStories.json'
        }
      );
    });

    it('correctly stores all words in the file', () => {
      expect(index.getIndex(filename).allWords).toEqual(
        ['alice', 'falls', 'into', 'an', 'unusual', 'alliance']
      );
    });
  });

  describe('DeleteFileIndex', () => {
    it('can successfully delete a file from the index', () => {
      expect(index.deleteFileIndex('stories.json')).toBe(true);
      expect(index.getIndex('stories.json')).toBe(false);
      expect(index.filenames.indexOf('stories.json')).toBe(-1);
    });

    it('returns false if filename does not exist in the index', () => {
      expect(index.deleteFileIndex('abcdef.json')).toBe(false);
    });
  });

  describe('SeachIndex', () => {
    beforeAll(() => {
      index.createIndex(books, 'books.json');
    });

    it('should return an object containing the search result(s)', () => {
      expect(typeof index.searchIndex('alice')).toEqual('object');
    });

    it('result should contain an array of files where the search key was found',
    () => {
      expect(index.searchIndex('alice').filenames).toEqual(
        ['shortStories.json', 'books.json']
        );
    });

    it('should return valid search results', () => {
      expect(index.searchIndex('alice seek')).toEqual(
        {
          filenames: ['shortStories.json', 'books.json'],
          'books.json': {
            allWords: ['alice', 'seek'],
            words: {
              alice: [true, false, false],
              seek: [false, true, true]
            }
          },
          'shortStories.json': {
            allWords: ['alice'],
            words: {
              alice: [true, false, false]
            }
          }
        }
      );
    });

    it('should return false if nothing was found', () => {
      expect(index.searchIndex('abcdefgh#')).toBe(false);
    });

    it('should return false if searchKey is an empty string', () => {
      expect(index.searchIndex('', filename)).toBe(false);
    });

    it('can search correctly when filename is passed in', () => {
      expect(index.searchIndex('alice hahaha unusual', filename)).toEqual(
        {
          filenames: ['shortStories.json'],
          'shortStories.json': {
            allWords: ['alice', 'unusual'],
            words: {
              alice: [true, false, false],
              unusual: [false, true, true],
            }
          }
        }
      );
    });
  });
});
