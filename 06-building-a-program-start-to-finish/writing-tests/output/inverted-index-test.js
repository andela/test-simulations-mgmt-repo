/* eslint-disable no-undef */

const invalidKeys = require('./invalidKeys.json'); // bad content
const validBook = require('./validBook.json'); // good content
const fileTextString = require('./fileTextString.json'); // text objects
const fileTextArray = require('./fileTextArray.json'); // text Arrays
// search objects
const allText = require('./allText.json');
const allTitles = require('./allTitles.json');


const invertedIndex = new InvertedIndex();
describe('INVERTED INDEX CLASS TESTS', () => {
  describe('Inverted Index classes', () => {
    it('should check that it the class has a createIndex method', () => {
      expect(typeof InvertedIndex.prototype.createIndex).toBe('function');
    });

    it('should check that class has a validateContent method', () => {
      expect(typeof InvertedIndex.validateContent).toBe('function');
    });

    it('should check that it has a normalizeAllText method', () => {
      expect(typeof InvertedIndex.prototype.normalizeAllText).toBe('function');
    });

    it('should check that it has a populateIndex method', () => {
      expect(typeof InvertedIndex.prototype.populateIndex).toBe('function');
    });

    it('should check that it has a searchIndex method', () => {
      expect(typeof InvertedIndex.prototype.searchIndex).toBe('function');
    });
  });

  describe('Search Index Function', () => {
    it('should return undefined for words not in book', () => {
      expect(invertedIndex.searchIndex(
        'enters,alliance, truck', 'goodOne.json', allText))
        .toEqual(
        {
          enters: [1],
          alliance: [2],
          truck: undefined
        }
        );
    });
    it('should return undefined for words not in each book in file', () => {
      expect(invertedIndex.searchIndex(
        'alice,full,power,powerfull, magnificent', 'All', allText))
        .toEqual(
        {
          'goodOne.json': [
            {
              alice: [1],
              full: undefined,
              power: undefined,
              powerfull: undefined,
              magnificent: undefined
            }
          ],
          'goodThree.json': [
            {
              alice: undefined,
              full: [1],
              power: undefined,
              powerfull: undefined,
              magnificent: undefined
            }
          ],
          'goodTwo.json': [
            {
              alice: [3],
              full: undefined,
              power: undefined,
              powerfull: undefined,
              magnificent: undefined
            }
          ]
        }
        );
    });
  });

  describe('Populate Index Function', () => {
    it('should return an object with all words and their respective indexes',
    () => {
      expect(invertedIndex.populateIndex(fileTextArray))
        .toEqual(
        {
          a: [1, 3],
          rabbit: [1],
          hole: [1],
          man: [2],
          elf: [2],
          dwarf: [2],
          wizard: [2],
          and: [2, 3],
          hobbit: [2],
          alice: [3],
          falls: [3],
          enters: [3],
          world: [3],
          imagination: [4],
          of: [4],
          an: [4],
          usual: [4],
          spoon: [4]
        }
        );
    });
  });

  describe('Transform To Array Function', () => {
    it('should return an array with all words from all books', () => {
      expect(invertedIndex.normalizeAllText(fileTextArray))
        .toEqual(
        ['a', 'rabbit', 'hole', 'man', 'elf', 'dwarf', 'wizard',
        'and', 'hobbit', 'alice', 'falls', 'and', 'enters', 'a',
        'world', 'imagination', 'of', 'an', 'usual', 'spoon']
        );
    });
  });

  describe('Create Function', () => {
    it('should return an object with all words and their respective indexes',
    () => {
      expect(invertedIndex.createIndex(validBook, 'validBook.json'))
        .toEqual(
        {
          alice: [1],
          falls: [1],
          and: [1],
          enters: [1],
          a: [1, 3],
          world: [1],
          an: [2],
          unusual: [2],
          alliance: [2],
          of: [2],
          man: [2],
          rabbit: [3],
          with: [3],
          wizarding: [3],
          powers: [3]
        }
        );
    });
  });

  describe('Validate Content Function', () => {
    it('should return true when given a valid book as input', () => {
      expect(InvertedIndex.validateContent(validBook))
        .toBe(true);
    });
    it('should return false when given an invalid book as input', () => {
      expect(InvertedIndex.validateContent(invalidKeys))
        .toBe(false);
    });
  });
});
