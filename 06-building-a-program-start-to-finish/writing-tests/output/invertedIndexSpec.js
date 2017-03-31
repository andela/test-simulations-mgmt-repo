const books = require('./books/books.json');
const shortStories = require('./books/shortStories.json');
const empty = require('./books/empty.json');
const missingText = require('./books/missingText.json');
const notArray = require('./books/notArray.json');
const wrongData = require('./books/wrongData.json');

const index = new InvertedIndex();
const filename = 'shortStories.json';

describe('InvertedIndex:', () => {
  describe('Constructor', () => {
    it('can create an instance of InvertedIndex', () => {
      expect(typeof index).toEqual('object');
    });

    it('initializes properties correctly', () => {
      expect(index.files).toEqual([]);
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

  describe('CreateIndex', () => {
    it('returns true if file index was created successfully', () => {
      expect(index.createIndex(shortStories, filename)).toBe(true);
    });

    it('creates an index object', () => {
      expect(typeof index[filename]).toEqual('object');
    });

    it('returns false if file already exists', () => {
      expect(index.createIndex(shortStories, filename)).toBe(false);
    });

    it('correctly stores the total number of books and their titles', () => {
      expect(index[filename].bookTitles).toEqual(
        ['Alice', 'Lord of the Rings', 'Rings']
      );
      expect(index[filename].bookTitles.length).toBe(3);
    });

    it('creates the correct index object', () => {
      expect(index[filename]).toEqual(
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
      expect(index[filename].allWords).toEqual(
        ['alice', 'falls', 'into', 'an', 'unusual', 'alliance']
      );
    });
  });

  describe('GetIndex', () => {
    it('should return an object', () => {
      expect(typeof index.getIndex('shortStories.json')).toEqual('object');
    });

    it('should return the correct index object', () => {
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

    it('should return false if file index was not found', () => {
      expect(index.getIndex('notIndex.json')).toBe(false);
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
      expect(index.searchIndex('alice').files).toEqual(
        ['shortStories.json', 'books.json']
        );
    });

    it('should return valid search results', () => {
      expect(index.searchIndex('alice seek')).toEqual(
        {
          files: ['shortStories.json', 'books.json'],
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
          files: ['shortStories.json'],
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

  describe('DeleteFileIndex', () => {
    it('can successfully delete a file from the index', () => {
      expect(index.deleteFileIndex(filename)).toBe(true);
      expect(index.getIndex(filename)).toBe(false);
      expect(index.files.indexOf(filename)).toBe(-1);
    });

    it('returns false if filename does not exist in the index', () => {
      expect(index.deleteFileIndex('abcdef.json')).toBe(false);
    });
  });
});
