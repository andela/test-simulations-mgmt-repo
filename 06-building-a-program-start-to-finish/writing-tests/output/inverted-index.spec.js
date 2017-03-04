/* eslint-disable no-unsed-vars */
/* eslint-disable no-undef */

const emptyBook = require('./empty-book..json');
const badBookOne = require('./bad-book-one.json');
const badData = require('./bad-book-two.json');
const badArray = require('./badArray.json');
const validBooks = require('./valid-books.json');
const data = require('./data.json');

const invertedIndex = new InvertedIndex();


describe('UTILITY CLASS TESTS', () => {
  describe('VALIDATES INPUT DATA', () => {
    it('should return false for an invalid book file', () => {
      expect(InvertedIndexUtility.validateInput(emptyBook)).toBe(false);
      expect(InvertedIndexUtility.validateInput(badBookOne)).toBe(false);
      expect(InvertedIndexUtility.validateInput(badArray)).toBe(false);
    });
    it('should return true for valid book files', () => {
      expect(InvertedIndexUtility.validateInput(validBooks)).toBe(true);
    });
  });
  describe('GENERATES TOKEN', () => {
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
  describe('CREATES UNIQUE WORDS', () => {
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
  describe('RETURNS BOOK TEXT', () => {
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
  describe('BUILDS INDEX', () => {
    it('should return true when building index for  valid data', () => {
      expect(invertedIndex.buildIndex(validBooks)).toBe(true);
    });
    it('should return false when building index for invalid data', () => {
      expect(invertedIndex.buildIndex(badData)).toBe(false);
    });
    it('should return false when building index for an invalid type', () => {
      expect(invertedIndex.buildIndex(badArray)).toBe(false);
    });
  });
  describe('SEARCH THROUGH INDEX', () => {
    it(`should take in a word and return 
    books the words can be found in`, () => {
      expect(invertedIndex.searchIndex('to'))
      .toEqual(['The Lord of the Rings: The Fellowship of the Ring.']);
    });
    it(`should take in a word that is not indexed 
    and return an empty array indicating not found`, () => {
      expect(invertedIndex.searchIndex('the'))
      .toEqual([]);
    });
  });
});

