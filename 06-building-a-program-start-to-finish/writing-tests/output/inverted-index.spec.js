/* eslint-disable no-unsed-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unresolved */

const emptyBook = require('./empty-book..json');
const badBookOne = require('./bad-book-one.json');
const badData = require('./bad-book-two.json');
const badArray = require('./badArray.json');
const validBooks = require('./valid-books.json');
const data = require('./data.json');
const newData = require('./newData.json');
const builtIndex = require('./testIndex.json');


const invertedIndex = new InvertedIndex();
const mockIndex = new InvertedIndex();
mockIndex.buildIndex(newData, 'newData.json');


describe('UTILITY CLASS TESTS', () => {
  describe('VALIDATE FUNCTION', () => {
    it('should return false for an invalid book file', () => {
      expect(InvertedIndexUtility.validateInput(emptyBook)).toBe(false);
      expect(InvertedIndexUtility.validateInput(badBookOne)).toBe(false);
      expect(InvertedIndexUtility.validateInput(badArray)).toBe(false);
    });
    it('should return true for valid book files', () => {
      expect(InvertedIndexUtility.validateInput(validBooks)).toBe(true);
    });
  });
  describe('GENERATE-TOKEN FUNCTION', () => {
    it('should return a string all in lower cases', () => {
      expect(InvertedIndexUtility.generateToken('ABCDRFGHIJKL'))
       .toEqual(['abcdrfghijkl']);
    });
    it('should return a string void of ambiguous characters', () => {
      expect(InvertedIndexUtility
       .generateToken('.../i. am?! , n$o#t o"k[a]+y'))
       .toEqual(['i', 'am', 'not', 'okay']);
    });
  });
  describe('CREATE-UNIQUE-WORDS FUNCTION', () => {
    it(`should return an array of unique words
     when it encounters multiple occurrences of a particular word`, () => {
      expect(InvertedIndexUtility.createUniqueWords(['alice',
        'alice'])).toEqual(['alice']);
      expect(InvertedIndexUtility.createUniqueWords(['alice', 'alice',
        'boy', 'girl', 'child', 'boy'])).toEqual(['alice',
          'boy', 'girl', 'child']);
    });
  });
});
describe('INVERTED-INDEX CLASS TESTS', () => {
  describe('GET-BOOK-TEXT FUNCTION', () => {
    it(`should return the book text when given a
    valid book as input`, () => {
      expect(invertedIndex.getBookText(data))
       .toBe('how did she get there abeg?');
    });
    it(`should return false for the book text when given an
   invalid book as input`, () => {
      expect(invertedIndex.getBookText(badData))
       .toBe(false);
    });
  });
  describe('BUILD-INDEX FUNCTION', () => {
    it('should return true when building index for  valid data', () => {
      expect(invertedIndex.buildIndex(validBooks, 'validBooks')).toBe(true);
    });
    it('should return false when building index for invalid data', () => {
      expect(invertedIndex.buildIndex(badData, badData)).toBe(false);
    });
    it('should return false when building index for an invalid type', () => {
      expect(invertedIndex.buildIndex(badArray, 'badArray')).toBe(false);
    });
    it(`should return correct index when
     building index for a valid file`, () => {
      expect(mockIndex.mainIndex).toEqual(builtIndex);
    });
  });
  describe('SEARCH-ALL FUNCTION', () => {
    it(`should take in a word and return all
    books the words can be found in`, () => {
      expect(invertedIndex.searchAll('to'))
      .toEqual(['The Lord of the Rings: The Fellowship of the Ring.']);
    });
    it(`should take in a word that is not indexed 
    and return an empty array indicating not found`, () => {
      expect(invertedIndex.searchAll('get'))
      .toEqual([]);
    });
  });
  describe('SEARCH-BY-FILE FUNCTION', () => {
    it(`should take in a word and a file name and
     return search results for that file`, () => {
      expect(mockIndex.searchByFile('abeg', 'newData.json'))
      .toEqual(['Alice in wonderland']);
    });
    it(`should take in words not available in a file
     and a file name and return search results for`, () => {
      expect(mockIndex.searchByFile('our', 'newData.json'))
      .toEqual([]);
    });
  });
});

