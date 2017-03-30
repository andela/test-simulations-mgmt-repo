const InvertedIndex = require('../../src/InvertedIndex.js');
const samples = require('../samples');
const FileAPI = require('file-api');

const File = FileAPI.File;

describe('Inverted Index Test Suite: ', () => {
  describe('Reading file data: ', () => {
    it('should read and return the contents of a file via callback', (done) => {
      const file = new File('./validBooks.json');
      InvertedIndex.readFile(file, (event) => {
        expect(JSON.parse(event.target.result)).toEqual(samples.validBooks);
        done();
      })
    });
  });

  describe('Validation of file data: ', () => {
    it('should return false if book data is not an array of object literals', () => {
      expect(InvertedIndex.validateFile('andela')).toBe(false);
      expect(InvertedIndex.validateFile(19)).toBe(false);
      expect(InvertedIndex.validateFile(['food', 'is', 'good'])).toBe(false);
    });

    it('should return false if book data is an empty array', () => {
      expect(InvertedIndex.validateFile([])).toBe(false);
    });

    it('should return false if book data is not properly structured', () => {
      expect(InvertedIndex.validateFile(samples.invalidBooks)).toBe(false);
    });

    it('should return true only if book data is properly structured', () => {
      expect(InvertedIndex.validateFile(samples.validBooks)).toBe(true);
    });
  });

  describe('Tokenization: ', () => {
    it('should return the correct tokens for a given string', () => {
      expect(InvertedIndex.tokenize(samples.validBooks[0].text)).toEqual(samples.tokens);
    });

    it('should remove special characters and extra whitespaces from a string', () => {
      expect(InvertedIndex.tokenize('I was giv%en $100 today!   (@ the *ma^ll)'))
        .toEqual(['i', 'was', 'given', '100', 'today', 'the', 'mall']);
    });
  });

  describe('Index creation/removal: ', () => {
    beforeEach(() => {
      this.invertedIndex = new InvertedIndex();
      this.invertedIndex.createIndex(samples.validBooks, 'validBooks.json');
      this.invertedIndex.createIndex(samples.extraBooks, 'extraBooks.json');
    });

    it('should extract and store the titles of the indexed books', () => {
      expect(this.invertedIndex.getTitles('validBooks.json')).toEqual(samples.titles);
    });

    it('should correctly index the books in a file', () => {
      expect(this.invertedIndex.getIndex('validBooks.json')).toEqual(samples.index);
    });

    it('should add books from newly uploaded files to the existing inverted index', () => {
      expect(this.invertedIndex.getTitles('extraBooks.json')).toEqual(samples.extraTitles);
      expect(this.invertedIndex.getIndex('extraBooks.json')).toEqual(samples.extraIndex);
    });

    it('should be able to remove added books from the existing inverted index', () => {
      this.invertedIndex.removeIndex('validBooks.json');
      expect(this.invertedIndex.indices.length).toEqual(1);
      expect(this.invertedIndex.indices[0]).toEqual(samples.extraIndex);
      expect(this.invertedIndex.getIndex('validBooks.json')).toEqual(null);
    });
  });

  describe('Index searching: ', () => {
    beforeEach(() => {
      this.invertedIndex = new InvertedIndex();
      this.invertedIndex.createIndex(samples.validBooks, 'validBooks.json');
      this.invertedIndex.createIndex(samples.extraBooks, 'extraBooks.json');
    });

    it('should return books containing the specified keywords', () => {
      expect(this.invertedIndex.searchIndex('the death he comes', ['extraBooks.json', 'validBooks.json']).results)
        .toEqual(samples.searchResults);
    });
  });
});
