const books = require('./books/validFile.json');
const shortStories = require('./books/simpleValidFile.json');
const empty = require('./books/empty.json');
const emptyText = require('./books/emptyText.json');
const notArray = require('./books/notArray.json');
const wrongData = require('./books/wrongData.json');

const index = new InvertedIndex();
const filename = 'shortStories.json';

describe('InvertedIndex', () => {
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
      expect(InvertedIndex.validateFile(empty)).toBeFalsy();
      expect(InvertedIndex.validateFile(emptyText)).toBeFalsy();
      expect(InvertedIndex.validateFile(notArray)).toBeFalsy();
      expect(InvertedIndex.validateFile(wrongData)).toBeFalsy();
    });

    it('should not return false if a valid file was uploaded', () => {
      expect(InvertedIndex.validateFile(books)).not.toBeFalsy();
      expect(InvertedIndex.validateFile(shortStories)).not.toBeFalsy();
      expect(typeof InvertedIndex.validateFile(books)).toEqual('object');
    });

    it('should return the file content if the file is valid', () => {
      expect(InvertedIndex.validateFile(books)).toEqual(books);
      expect(InvertedIndex.validateFile(shortStories))
      .toEqual(shortStories);
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
  });

  describe('CreateIndex', () => {
    it('creates an index object from the file content', () => {
      expect(index.createIndex(shortStories, filename)).toBeTruthy();
      expect(typeof index[filename]).toEqual('object');
    });

    it('returns false if file already exists', () => {
      expect(index.createIndex(shortStories, filename)).toBeFalsy();
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
    it('should return the correct index', () => {
      expect(typeof index.getIndex('shortStories.json')).toEqual('object');
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
      expect(index.getIndex('notIndex.json')).toBeFalsy();
    });
  });

  describe('SeachIndex', () => {
    beforeAll(() => {
      index.createIndex(books, 'books.json');
    });

    it('should return an object containing the search results', () => {
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
      expect(index.searchIndex('abcdefgh#')).toBeFalsy();
    });

    it('should return false if searchKey is an empty string', () => {
      expect(index.searchIndex('', filename)).toBeFalsy();
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
      expect(index.deleteFileIndex(filename)).toBeTruthy();
      expect(index.getIndex(filename)).toBeFalsy();
      expect(index.files.indexOf(filename)).toBe(-1);
    });

    it('returns false if filename does not exist in the index', () => {
      expect(index.deleteFileIndex('abcdef.json')).toBeFalsy();
    });
  });
});
