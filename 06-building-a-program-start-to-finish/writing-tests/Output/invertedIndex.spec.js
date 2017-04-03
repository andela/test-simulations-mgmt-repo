import book from './../book.json';
import emptyBook from './../emptyBook.json';
import wrongFormat from './../wrongFormat.json';
import invalidBook from './../invalidBook.json';
import books from './../books.json';

const myInvertedIndex = new InvertedIndexClass();

/* Test Suites */
describe('Inverted Index Test', () => {
  describe('ReadFile', () => {
    beforeEach(() => {
      myInvertedIndex.files['book.json'] = book;
      myInvertedIndex.files['books.json'] = books;
    });
    it('should return false when checking an empty JSON array', () => {
      expect(myInvertedIndex.readFile(emptyBook))
        .toBeFalsy();
    });
    it('should return false when checking a wrongformatted JSON array', () => {
      expect(myInvertedIndex.readFile(wrongFormat))
        .toBeFalsy();
    });
    it('should return false when book is not an array', () => {
      expect(myInvertedIndex.readFile(invalidBook))
        .toBeFalsy();
    });
    it('should return true if a valid JSON array', () => {
      expect(myInvertedIndex.readFile(book))
        .toBeTruthy();
    });

    it('should return correct keys for files when file is saved', () => {
      expect(Object.keys(myInvertedIndex.files))
        .toEqual(['book.json', 'books.json']);
    });

    it('should ensure the file content is saved accurrately', () => {
      expect(myInvertedIndex.files['book.json'])
        .toEqual(book);
    });
  });
  describe('Validate File', () => {
    it('should return false when file does not contain "title" & "text" format'
    , () => {
      expect(myInvertedIndex.validateFile(wrongFormat))
      .toBeFalsy();
    });
    it('verifies that the JSON file is valid', () => {
      expect(myInvertedIndex.validateFile(book).length).toEqual(2);
    });
  });
  describe('Create Index Table', () => {
    beforeEach(() => {
      myInvertedIndex.files['books.json'] = books;
      myInvertedIndex.files['book.json'] = book;
    });
    it('should ensure that index is created', () => {
      expect(myInvertedIndex.createIndex('book.json'))
        .toBeTruthy();
    });
    it('should ensure that index is created', () => {
      expect(myInvertedIndex.createIndex('books.json'))
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
    beforeEach(() => {
      myInvertedIndex.files['books.json'] = books;
    });
    it('should return correct terms in form of string in an array', () => {
      expect(myInvertedIndex.tokenize(books[0].text))
      .toEqual(['alice', 'falls', 'into', 'a', 'rabbit', 'hole', 'and',
        'enters', 'a', 'world', 'full', 'of', 'imagination']);
    });
    it('should return correct terms in terms of lowercase', () => {
      expect(myInvertedIndex.tokenize(books[0].text)[0]).toEqual('alice');
    });
    it('should return array of terms without space or invalid characters',
    () => {
      expect(myInvertedIndex.tokenize('alice.,&-falls')).toEqual(['alice',
        'falls']);
    });
  });
  describe('Search Index', () => {
    beforeEach(() => {
      myInvertedIndex.files['books.json'] = books;
    });
    it('should return correct index of the search term in all books', () => {
      expect(myInvertedIndex.searchIndex('alice'))
      .toEqual({ 'book.json': { alice: [0] }, 'books.json': { alice: [0] } });
    });
    it('should return correct index of the search term in books3.json', () => {
      expect(myInvertedIndex.searchIndex('an alice',
      ['book.json', 'books.json']))
      .toEqual({ 'book.json': { an: [1], alice: [0] },
        'books.json': { an: [1, 2], alice: [0] } });
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
