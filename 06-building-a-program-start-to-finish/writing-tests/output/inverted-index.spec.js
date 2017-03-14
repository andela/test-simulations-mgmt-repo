const books = require('../books.json');
const adventureBooks = require('../adventure-books.json');
const emptyArray = require('../emptyBook.json');
const invalidContent = require('../invalid-content.json');
const invalidFile = require('../invalid-file.json');
const invalidKey = require('../invalid-key.json');

const invertedIndex = new InvertedIndex();

describe('validateFile ', () => {
  it(`should verify file have keys named "title" and "text"
    with string for values`, () => {
    expect(invertedIndex.validateFile(invalidContent))
      .toBe('Invalid file content');
    expect(invertedIndex.validateFile(invalidKey))
      .toBe('Invalid file content');
  });
  it('should verify file is not empty', () => {
    expect(invertedIndex.validateFile(emptyArray))
      .toBe('Empty file');
  });
  it('should verify a file is valid', () => {
    expect(invertedIndex.validateFile(books))
      .toBe('Valid file');
  });
  it('should verify a file is invalid', () => {
    expect(invertedIndex.validateFile(invalidFile))
      .toBe('Invalid file');
  });
});

describe('tokenize function ', () => {
  const bookToTokenize = [{ title: 'Alice , / ?', text: 'enters a a.' }];

  it('should return an " array " of words for a file content input', () => {
    expect(Array.isArray(InvertedIndex
      .tokenize(`${bookToTokenize[0].title} ${bookToTokenize[0].text}`)))
      .toBe(true);
  });
  it(`should return an "array" of filtered words for a 
  file content input`, () => {
    expect(InvertedIndex
      .tokenize(`${bookToTokenize[0].title} ${bookToTokenize[0].text}`))
      .toEqual(
        ['alice', 'enters', 'a']
      );
  });
});

describe('createIndex function', () => {
  it(`should map the string keys to the correct objects in 
  the JSON array`, () => {
    expect(invertedIndex.createIndex(adventureBooks, 'adventure-books.json'))
      .toEqual({
        'adventure-books.json': {
          king: [0],
          solomons: [0],
          mines: [0],
          it: [0],
          tells: [0],
          of: [0],
          a: [0, 1],
          search: [0],
          an: [0],
          unexplored: [0],
          region: [0],
          africa: [0],
          by: [0],
          group: [0],
          adventurers: [0],
          treasure: [1],
          island: [1],
          wild: [1],
          seaman: [1],
          billy: [1],
          bones: [1],
          comes: [1],
          to: [1],
          stay: [1],
          bringing: [1],
          with: [1],
          him: [1],
          large: [1],
          sea: [1],
          chest: [1]
        }
      });
  });
});

describe('getIndex function', () => {
  beforeAll(() => {
    invertedIndex.createIndex(books, 'books.json');
  });
  it('should return "undefined" if index does not exist', () => {
    expect(invertedIndex.getIndex(' '))
      .toEqual(undefined);
    expect(invertedIndex.getIndex('books4'))
      .toEqual(undefined);
  });
  it(`should verify that the index of JSON file can be gotten 
  after file indexed`, () => {
    expect(invertedIndex.getIndex('books.json'))
      .toBeDefined();
  });
  it('should get the correct index of a word in a file', () => {
    expect(invertedIndex.getIndex('books.json').and)
      .toEqual(
        [0, 1]
      );
    expect(invertedIndex.getIndex('adventure-books.json').bringing)
      .toEqual(
        [1]
      );
  });
});

describe('searchIndex function', () => {
  it(`should return an array of the indices of the correct objects that contain
    the words in the search query`, () => {
    expect(invertedIndex
      .searchIndex('a rabbit alliance with man', 'books.json')).toEqual({
        'books.json': {
          a: [0, 1],
          rabbit: [0],
          alliance: [1],
          with: [],
          man: [1]
        }
      });
    expect(invertedIndex.searchIndex('a king billy', 'adventure-books.json'))
      .toEqual({
        'adventure-books.json': {
          a: [0, 1],
          king: [0],
          billy: [1]
        }
      });
  });
  it('should normalize search string before search', () => {
    expect(invertedIndex
      .searchIndex('A RABBIT!@#$%^&*()+=-][}{/?><.,|}]`~€‹›', 'books.json'))
      .toEqual({
        'books.json': {
          a: [0, 1],
          rabbit: [0]
        }
      });
  });
  it(`should return an object with empty indices books key if no
    match is found`, () => {
    expect(invertedIndex.searchIndex('house', 'books.json')).toEqual({
      'books.json': {
        house: []
      }
    });
  });
  it(`should search all indexed files if second argument not passed to
    searchIndex function`, () => {
    expect(invertedIndex.searchIndex('alice king ring tells about a hobbit'))
      .toEqual({
        'adventure-books.json': {
          alice: [],
          king: [0],
          ring: [],
          tells: [0],
          about: [],
          a: [0, 1],
          hobbit: []
        },
        'books.json': {
          alice: [0],
          king: [],
          ring: [1],
          tells: [],
          about: [],
          a: [0, 1],
          hobbit: [1]
        }
      });
  });
});
