/* global InvertedIndexClass */
import book from './../book.json';
import bookempty from './../bookempty.json';
import bookwrongformat from './../bookwrongformat.json';
import notBook from './../notBook.json';
import books3 from './../books3.json';

const myInvertedIndex = new InvertedIndexClass();
myInvertedIndex.files['book.json'] = book;
myInvertedIndex.files['books3.json'] = books3;

/* Test Suites */
describe('Inverted Index Test', () => {
  describe('ReadFile', () => {
    it('should return false when checking an empty JSON array', () => {
      expect(myInvertedIndex.readFile(bookempty))
        .toBeFalsy();
    });
    it('should return false when checking an wrongformatted JSON array', () => {
      expect(myInvertedIndex.readFile(bookwrongformat))
        .toBeFalsy();
    });
    it('should return false when book is not an array', () => {
      expect(myInvertedIndex.readFile(notBook))
        .toBeFalsy();
    });
    it('should return true if a valid JSON array', () => {
      expect(myInvertedIndex.readFile(book))
        .toBeTruthy();
    });

    it('should return correct keys for files when file is saved', () => {
      expect(Object.keys(myInvertedIndex.files))
        .toEqual(['book.json', 'books3.json']);
    });

    it('should ensure the file content is saved accurrately', () => {
      expect(myInvertedIndex.files['book.json'])
        .toEqual(book);
    });
  });
  describe('Validate File', () => {
    it('should return false when file does not contain "title" & "text" format'
    , () => {
      expect(myInvertedIndex.validateFile(bookwrongformat))
      .toBeFalsy();
    });
  });
  it('verifies that the JSON file is valid', () => {
    expect(myInvertedIndex.validateFile(book).length).toEqual(2);
  });
  describe('Create Index Table', () => {
    it('should ensure that index is created', () => {
      expect(myInvertedIndex.createIndex('book.json'))
        .toBeTruthy();
    });
    it('should ensure that index is created', () => {
      expect(myInvertedIndex.createIndex('books3.json'))
        .toBeTruthy();
    });
  });
  describe('Get Index', () => {
    it('should ensure that index of a file is returned accurrately', () => {
      expect(myInvertedIndex.getIndex('book.json').alice)
      .toEqual([0]);
    });
  });
  describe('Tokenize', () => {
    it('should return correct terms in form of string in an array', () => {
      expect(myInvertedIndex.tokenize(books3[0].text))
      .toEqual(['alice', 'falls', 'into', 'a', 'rabbit', 'hole', 'and',
        'enters', 'a', 'world', 'full', 'of', 'imagination']);
    });
  });

  describe('Search Index', () => {
    it('should return correct index of the search term in all books', () => {
      expect(myInvertedIndex.searchIndex('alice'))
      .toEqual({ 'book.json': { alice: [0] }, 'books3.json': { alice: [0] } });
    });
    it('should return correct index of the search term in books3.json', () => {
      expect(myInvertedIndex.searchIndex('an alice',
      ['book.json', 'books3.json']))
      .toEqual({ 'book.json': { an: [1], alice: [0] },
        'books3.json': { an: [1, 2], alice: [0] } });
    });
    it('should return false when no result is found', () => {
      expect(myInvertedIndex.searchIndex('impossibility'))
        .toBeFalsy();
    });
    it('should return true when the result is found', () => {
      expect(myInvertedIndex.searchIndex('impossibility'))
        .toBeFalsy();
    });
  });
});
