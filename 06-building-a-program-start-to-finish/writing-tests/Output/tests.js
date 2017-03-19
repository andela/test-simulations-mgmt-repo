/* eslint-disable no-undef */
const books = require('../books.json');
const gotBooks = require('../gotBooks.json');
const emptyBook = require('../emptyBook.json');
const invalidContent = require('../invalidContent.json');
const invalidBook = require('../invalidBook.json');

const index = new InvertedIndex();
const property = Object.prototype.hasOwnProperty;

describe('Validate File', () => {
  it('checks to see if uploaded JSON file is the correct format', () => {
    expect(InvertedIndex.validateFile(invalidContent)).toBe(false);
    expect(InvertedIndex.validateFile(invalidBook)).toBe(false);
    expect(InvertedIndex.validateFile(emptyBook)).toBe(false);
    expect(InvertedIndex.validateFile(books)).toBe(true);
    expect(InvertedIndex.validateFile(gotBooks)).toBe(true);
  });
});

describe('Tokenize', () => {
  it('should be able to transform all words to lowercase and sort the words', () => {
    expect(InvertedIndex.tokenize(['Alice', 'In', 'Wonderland', 'What', 'is', 'she', 'Looking', 'for', 'There'])).toEqual(
            ['alice', 'for', 'in', 'is', 'looking', 'she', 'there', 'what', 'wonderland']
        );
  });
  it('should be able to remove every symbol and special character', () => {
    expect(InvertedIndex.tokenize(['Ali2ce', 'In', 'Won%de#rland', 'Wh%at', 'i@s', 'she', 'Lo%oking', 'for', 'The$re'])).toEqual(
            ['alice', 'for', 'in', 'is', 'looking', 'she', 'there', 'what', 'wonderland']
        );
  });
});

describe('createIndex ', () => {
  const createIndexObject = index.createIndex('books.json', books);
  it('should return an Object', () => {
    expect(typeof createIndexObject).toBe('object');
  });
  it('should not return an array', () => {
    expect(typeof createIndexObject).not.toBe('array');
  });
  it('should have properties "alice" and "wonderland"', () => {
    expect(property.call(createIndexObject, 'alice')).toBe(true);
    expect(property.call(createIndexObject, 'wonderland')).toBe(true);
  });
  it('should not have properties "elie" and "justapose"', () => {
    expect(property.call(createIndexObject, 'eiie')).toBe(false);
    expect(property.call(createIndexObject, 'justapose')).toBe(false);
  });
  it('should return 0 for properties "alice" and "rabbit"', () => {
    expect(createIndexObject.alice).toBe[0];
    expect(createIndexObject.rabbit).toBe[0];
  });
  it('should return 1 for properties "alliance" and "hobbit"', () => {
    expect(createIndexObject.alliance).toBe[1];
    expect(createIndexObject.hobbit).toBe[1];
  });
  it('should return undefined for properties "alanta" and "Honda"', () => {
    expect(createIndexObject.alanta).toBe(undefined);
    expect(createIndexObject.Honda).toBe(undefined);
  });
});

describe('storeIndex', () => {
  const bookArray = [['a',
    'a',
    'alice',
    'alice',
    'and',
    'enters',
    'falls',
    'full',
    'hole',
    'imagination',
    'in',
    'into',
    'of',
    'rabbit',
    'wonderland',
    'world'],
  ['a',
    'alliance',
    'an',
    'and',
    'destroy',
    'dwarf',
    'elf',
    'fellowship',
    'hobbit',
    'lord',
    'man',
    'of',
    'of',
    'of',
    'powerful',
    'ring',
    'ring',
    'rings',
    'seek',
    'the',
    'the',
    'the',
    'the',
    'to',
    'unusual',
    'wizard']];
  const search = index.storeIndex(books, bookArray);
  it('should return an Object', () => {
    expect(typeof search).toBe('object');
  });
  it('should not return a string', () => {
    expect(typeof search).not.toBe('string');
  });
  it('should have properties "falls" and "hole"', () => {
    expect(property.call(search, 'falls')).toBe(true);
    expect(property.call(search, 'hole')).toBe(true);
  });
  it('should not have properties "minimal" and "sucks"', () => {
    expect(property.call(search, 'minimal')).toBe(false);
    expect(property.call(search, 'sucks')).toBe(false);
  });
  it('should return 0 for properties "into" and "of"', () => {
    expect(search.into).toBe[0];
    expect(search.of).toBe[0];
  });
  it('should return 1 for properties "lord" and "powerful"', () => {
    expect(search.lord).toBe[1];
    expect(search.powerful).toBe[1];
  });
  it('should return undefined for properties "darklord" and "nothing"', () => {
    expect(search.darklord).toBe(undefined);
    expect(search.nothing).toBe(undefined);
  });
});

describe('getIndex', () => {
  const get = index.getIndex(books);
  it('should return an Object ', () => {
    expect(typeof get).toBe('object');
  });
  it('should not return an integer', () => {
    expect(typeof get).not.toBe('integer');
  });
  it('should have properties "alice" and "wonderland"', () => {
    expect(property.call(get, 'alice')).toBe(true);
    expect(property.call(get, 'wonderland')).toBe(true);
  });
  it('should not have properties "eiie" and "justapose"', () => {
    expect(property.call(get, 'eiie')).toBe(false);
    expect(property.call(get, 'justapose')).toBe(false);
  });
  it('should return 0 for properties "alice" and "rabbit"', () => {
    expect(get.alice).toBe[0];
    expect(get.rabbit).toBe[0];
  });
  it('should return 1 for properties "alliance" and "hobbit"', () => {
    expect(get.alliance).toBe[1];
    expect(get.hobbit).toBe[1];
  });
  it('should return undefined for properties "alanta" and "honda"', () => {
    expect(get.alanta).toBe(undefined);
    expect(get.Honda).toBe(undefined);
  });
});

describe('searchIndex', () => {
  index.getIndex(books);
  index.getIndex(gotBooks);
  const search = index.searchIndex(books, 'alice');
  const search2 = index.searchIndex(books, 'anja');
  const search3 = index.searchIndex('all', 'hole');
  const search4 = index.searchIndex('all', 'debby');
  it('should return an array', () => {
    expect(Array.isArray(search)).toBe(true);
    expect(Array.isArray(search3)).toBe(true);
  });
  it('should return 1 for search for "alice" in books', () => {
    expect(search[0].alice).toBe[1];
  });
  it('should return undefined for search for "anja" in books ', () => {
    expect(search2[0].anja).toBe(undefined);
  });
  it('should expect "hole" to be found when searching in "all"', () => {
    expect(search3[0]['books.json']).toBe[{ hole: [0] }];
  });
  it('should expect "debby" not to be found when searching in "all"', () => {
    expect(search4.debby).toBe(undefined);
  });
});
