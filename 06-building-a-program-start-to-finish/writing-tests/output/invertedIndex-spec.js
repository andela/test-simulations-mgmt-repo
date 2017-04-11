
/**
 * Dependencies declared globally
 */
const InvertedIndex = require('../app/js/invertedIndex.js'),
  invIndex = new InvertedIndex(),
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
    expect(typeof invIndex).toBe('object');
    expect(invIndex instanceof InvertedIndex).toBe(true);
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
    expect(invIndex.tokenize(book[0].title))
    .toEqual(['alice', 'in', 'wonderland']);
  });
});
/**
 * Test cases for createIndex method
 */
describe('createIndex method', () => {
  it('should return `true` if index is created', () => {
    expect(invIndex.createIndex('otherBook.json', otherBook))
    .toEqual(true);
  });

  it('should return `false` if index is not created', () => {
    expect(invIndex.createIndex('empty.json', empty))
    .toBeFalsy();
  });
});
/**
 * Test case for getIndex method
 */
describe('getIndex method', () => {
  it(`should return index of words and 
    number of books in a json file`, () => {
    const retObject = { words: { alice: [0],
      in: [0],
      wonderland: [0],
      a: [0],
      falls: [0],
      hole: [0],
      into: [0],
      rabbit: [0] },
      bookCount: 1 };
    expect(invIndex.getIndex(otherBook)).toEqual(retObject.word);
  });
});
/**
 * Test case for searchIndex method
 */
describe('searchIndex method', () => {
  it(`should return an object 
    containing searched index from an index created`, () => {
    const query = 'in';
    const retObject = { words: { alice: [0],
        in: [0],
        wonderland: [0],
        a: [0],
        falls: [0],
        hole: [0],
        into: [0],
        rabbit: [0] },
        bookCount: 1 },
      searchResult = { 'otherBook.json': { in: [0] } };
    expect(invIndex.searchIndex(retObject.word, query))
    .toEqual(searchResult);
  });

  it(`should return an object
      with empty array indicating query not found in index created`, () => {
    const query = 'femi';
    const retObject = { words: { alice: [0],
        in: [0],
        wonderland: [0],
        a: [0],
        falls: [0],
        hole: [0],
        into: [0],
        rabbit: [0] },
        bookCount: 1 },
      searchResult = { 'otherBook.json': { femi: [] } };
    expect(invIndex.searchIndex(retObject.word, query))
    .toEqual(searchResult);
  });
});
