
/**
 * Dependencies declared globally
 */
const InvertedIndex = require('../app/js/invertedIndex.js'),
  invertedIndex = new InvertedIndex(),
  badFormat = require('./books/badFormat.json'),
  empty = require('./books/empty.json'),
  book = require('./books/book.json'),
  otherBook = require('./books/otherBook.json');
/**
 * Test case for Class definition
 */
describe('InvertedIndex class', () => {
  it('should be defined', () => {
    expect(InvertedIndex).toBeDefined();
  });
});
/**
 * Test case for constructor
 */
describe('Constructor', () => {
  it('should be able to create an instance of InvertedIndex class', () => {
    expect(typeof invertedIndex).toBe('object');
    expect(invertedIndex instanceof InvertedIndex).toBe(true);
  });
});
/**
 * Test Cases for validateFile method
 */
describe('validateFile', () => {
  it('should return `true` for valid json file', () => {
    expect(InvertedIndex.validateFile('books.json', book)).toBe(true);
  });

  it('should return `false` for empty files', () => {
    expect(InvertedIndex.validateFile('empty.json', empty)).toBe(false);
  });

  it('should return `false` for invalid file', () => {
    expect(InvertedIndex.validateFile('bad-format', badFormat)).toBe(false);
  });
});
/**
 * Test cases for tokenize method
 */
describe('tokenize method', () => {
  it(`should return array of unique words
   without whitespace/characters`, () => {
    expect(invertedIndex.tokenize(book[0].title))
    .toEqual(['alice', 'in', 'wonderland']);
  });
});
/**
 * Test cases for createIndex method
 */
describe('createIndex method', () => {
  it('should return `true` if index is created', () => {
    expect(invertedIndex.createIndex('otherBook.json', otherBook))
    .toEqual(true);
  });

  it('should return `false` if index is not created', () => {
    expect(invertedIndex.createIndex('empty.json', empty))
    .toBeFalsy();
  });
});
/**
 * Test case for getIndex method
 */
describe('getIndex method', () => {
  it(`should return index of words and 
    number of books in a json file`, () => {
    const returnedObject = { words: { alice: [0],
      in: [0],
      wonderland: [0],
      a: [0],
      falls: [0],
      hole: [0],
      into: [0],
      rabbit: [0] },
      bookCount: 1 };
    expect(invertedIndex.getIndex(otherBook)).toEqual(returnedObject.word);
  });
});
/**
 * Test case for searchIndex method
 */
describe('searchIndex method', () => {
  it(`should return an object 
    containing searched index from an index created`, () => {
    const query = 'in';
    const returnedObject = { words: { alice: [0],
        in: [0],
        wonderland: [0],
        a: [0],
        falls: [0],
        hole: [0],
        into: [0],
        rabbit: [0] },
        bookCount: 1 },
      searchResult = { 'otherBook.json': { in: [0] } };
    expect(invertedIndex.searchIndex(returnedObject.word, query))
    .toEqual(searchResult);
  });

  it(`should return an object
      with empty array indicating query not found in index created`, () => {
    const query = 'femi';
    const returnedObject = { words: { alice: [0],
        in: [0],
        wonderland: [0],
        a: [0],
        falls: [0],
        hole: [0],
        into: [0],
        rabbit: [0] },
        bookCount: 1 },
      searchResult = { 'otherBook.json': { femi: [] } };
    expect(invertedIndex.searchIndex(returnedObject.word, query))
    .toEqual(searchResult);
  });
});
