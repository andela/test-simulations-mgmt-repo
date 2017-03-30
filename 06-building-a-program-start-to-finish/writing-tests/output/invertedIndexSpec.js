const validFile = require('./books/validFile.json');
const simpleValidFile = require('./books/simpleValidFile.json');
const empty = require('./books/empty.json');
const emptyText = require('./books/emptyText.json');
const notArray = require('./books/notArray.json');
const wrongData = require('./books/wrongData.json');

const index = new InvertedIndex();

describe('InvertedIndex', () => {
  describe('Constructor', () => {
    it('can create an instance of InvertedIndex', () => {
      expect(typeof index).toEqual('object');
    });
    it('initializes properties correctly', () => {
      expect(index.files).toEqual([]);
      expect(index.showAllFiles).toBeFalsy();
      expect(index.indexed).toEqual({});
      expect(index.showAllFilesSearch).toBeFalsy();
      expect(index.searchAllResult).toEqual({});
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
      expect(InvertedIndex.validateFile(validFile)).not.toBeFalsy();
      expect(InvertedIndex.validateFile(simpleValidFile)).not.toBeFalsy();
      expect(typeof InvertedIndex.validateFile(validFile)).toEqual('object');
    });
    it('should return the file content if the file is valid', () => {
      expect(InvertedIndex.validateFile(validFile)).toEqual(validFile);
      expect(InvertedIndex.validateFile(simpleValidFile))
      .toEqual(simpleValidFile);
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
    beforeAll(() => {
      this.filename = 'simpleValidFile.json';
    });

    it('creates an index object from the file content', () => {
      expect(index.createIndex(simpleValidFile, this.filename)).toBeTruthy();
      expect(typeof index.getIndex(this.filename)).toEqual('object');
    });
    it('returns false if file already exists', () => {
      expect(index.createIndex(simpleValidFile, this.filename)).toBeFalsy();
    });
    it('correctly stores the total number of books and their titles', () => {
      expect(index.getIndex(this.filename).bookTitles).toEqual(
        ['Alice', 'Lord of the Rings', 'Rings']
      );
      expect(index.getIndex(this.filename).bookTitles.length).toBe(3);
    });
    it('creates the correct index object', () => {
      expect(index.getIndex(this.filename).words.alice)
      .toEqual([true, false, false]);
      expect(index.getIndex(this.filename).words.falls)
      .toEqual([true, true, false]);
      expect(index.getIndex(this.filename).words.alliance)
      .toEqual([false, true, true]);
    });
    it('correctly stores all words in the file', () => {
      expect(index.getIndex(this.filename).allWords).toEqual(
        ['alice', 'falls', 'into', 'an', 'unusual', 'alliance']
      );
    });
  });

  describe('GetIndex', () => {
    it('should return the correct index', () => {
      expect(typeof index.getIndex('simpleValidFile.json')).toEqual('object');
      expect(index.getIndex(this.filename)).toEqual(
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
          filename: 'simpleValidFile.json'
        }
      );
    });
    it('should return false if file index was not found', () => {
      expect(index.getIndex('notIndex.json')).toBeFalsy();
    });
    it('sets the current indexed file to the result', () => {
      expect(index.getIndex(this.filename)).toEqual(index.indexed);
    });
  });

  describe('SearchIndex', () => {
    it('should return false if filename does not exist', () => {
      expect(index.searchIndex('alice', 'wrongData.json')).toBeFalsy();
    });
    it('should return return the correct search result', () => {
      expect(typeof index.searchIndex('alice', this.filename))
      .toEqual('object');
      expect(index.searchIndex('alice hahaha unusual', this.filename)).toEqual(
        {
          bookTitles: ['Alice', 'Lord of the Rings', 'Rings'],
          allWords: ['alice', 'unusual'],
          words: {
            alice: [true, false, false],
            unusual: [false, true, true],
          }
        }
      );
    });
    it('should return false if searchKey is an empty string', () => {
      expect(index.searchIndex('', this.filename)).toBeFalsy();
    });
    it('should return false if nothing was found', () => {
      expect(index.searchAll('abcdefgh#', this.filename)).toBeFalsy();
    });
  });

  describe('SeachAll', () => {
    beforeAll(() => {
      index.createIndex(validFile, 'validFile.json');
    });

    it('should return an object containing the search results', () => {
      expect(typeof index.searchAll('alice')).toEqual('object');
    });
    it('result should contain an array of files where the search key was found',
    () => {
      expect(index.searchAll('alice').files).toEqual(
        ['simpleValidFile.json', 'validFile.json']
        );
    });
    it('should return valid search results', () => {
      expect(index.searchAll('alice')[this.filename]).toEqual(
        {
          bookTitles: ['Alice', 'Lord of the Rings', 'Rings'],
          allWords: ['alice'],
          words: {
            alice: [true, false, false],
          }
        }
      );
    });
    it('should return false if nothing was found', () => {
      expect(index.searchAll('abcdefgh#')).toBeFalsy();
    });
  });

  describe('DeleteFile', () => {
    it('can successfully delete a file from the index', () => {
      expect(index.deleteFile(this.filename)).toBeTruthy();
      expect(index.getIndex(this.filename)).toBeFalsy();
      expect(index.files.indexOf(this.filename)).toBe(-1);
    });
    it('returns false if filename does not exist in the index', () => {
      expect(index.deleteFile('abcdef.json')).toBeFalsy();
    });
  });
});
