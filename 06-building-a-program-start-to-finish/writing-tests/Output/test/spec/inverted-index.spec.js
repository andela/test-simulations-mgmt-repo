const chai = require('chai');
const InvertedIndex = require('../../src/js/inverted-index.js');
const books = require('../books.json');
const books2 = require('../books2.json');
const emptyBook = require('../emptyBook.json');
const invalidBook = require('../invalidBook.json');

const expect = chai.expect;
const newIndex = new InvertedIndex();
const sampleData = ' Mary had a    little #$%^6 lamb, a little lamb Mary had';


describe('Validate files', () => {
  it('should check that uploaded file is valid JSON', () => {
    expect(newIndex.isValidFile(books)).to.be.true;
    expect(newIndex.isValidFile(emptyBook)).to.be.false;
    expect(newIndex.isValidFile(invalidBook)).to.be.false;
  });

  it('should check that uploaded file is not empty', () => {
    expect(books.length).to.not.equal(0);
    expect(emptyBook.length).to.equal(0);
  });

  it("should have a valid 'title' and 'text'", () => {
    expect(books[0].title).to.not.be.undefined;
    expect(books[0].text).to.not.be.undefined;
  });
});

describe('Normalize Text', () => {
  it('should return an array containing only alphabets', () => {
    expect(InvertedIndex.normalizeText(sampleData)).to.not.include(' ');
    expect(InvertedIndex.normalizeText(sampleData)).to.match(/^[a-zA-Z]/);
  });

  it('should return an array containing the correct number of words', () => {
    expect(InvertedIndex.normalizeText(sampleData).length).to.equal(10);
  });

  it('should return an array containing the correct words', () => {
    expect(InvertedIndex.normalizeText(sampleData)).to.eql(['a',
      'a',
      'had',
      'had',
      'lamb',
      'lamb',
      'little',
      'little',
      'mary',
      'mary']);
  });
});

describe('Unique words', () => {
  it('should not return any duplicate words', () => {
    expect(InvertedIndex.uniqueWords(sampleData).length).to.equal(5);
    expect(InvertedIndex.uniqueWords(sampleData))
      .to.eql(['a', 'had', 'lamb', 'little', 'mary']);
  });
});

describe('Populate index', () => {
  newIndex.createIndex('books.json', books);
  newIndex.createIndex('books2.json', books2);
  it('should create index once JSON file has been read', () => {
    expect(Object.keys(newIndex.indices).length).to.equal(2);
  });

  it('should map words to the correct document location', () => {
    expect(newIndex.getIndex('books.json')).to.eql({
      alice: [0],
      in: [0, 1, 2],
      wonderland: [0],
      falls: [0],
      into: [0],
      a: [0, 1, 2],
      rabbit: [0],
      hole: [0],
      and: [0, 1, 2],
      enters: [0],
      world: [0],
      full: [0],
      of: [0, 1, 2],
      imagination: [0],
      the: [1, 2],
      lord: [1, 2],
      rings: [1, 2],
      fellowship: [1, 2],
      ring: [1, 2],
      an: [0, 1, 2],
      unusual: [1, 2],
      alliance: [1, 2],
      man: [1, 2],
      elf: [1, 2],
      dwarf: [1, 2],
      wizard: [1, 2],
      hobbit: [1, 2],
      seek: [1, 2],
      to: [0, 1, 2],
      destroy: [1, 2],
      powerful: [1, 2]
    });
  });
});

describe('Get index', () => {
  it('should return the accurate index for indexed files', () => {
    expect(newIndex.getIndex('books')).to.be.defined;
  });
});

describe('Search index', () => {
  it('should have search index method in the class', () => {
    expect(InvertedIndex.searchIndex).to.be.defined;
  });

  it('Should return the correct index for words searched for', () => {
    expect(newIndex.searchIndex('fellowship', 'books.json')).to.eql({
      fellowship: [1, 2]
    });
    expect(newIndex.searchIndex('Alice', 'books.json')).to.eql({
      alice: [0]
    });
    expect(newIndex.searchIndex('A', 'books.json')).to.eql({
      a: [0, 1, 2]
    });
  });

  it('should handle a varied number of search terms', () => {
    expect(newIndex.searchIndex('a alice alliance', 'books.json'))
      .to.eql({ a: [0, 1, 2], alice: [0], alliance: [1, 2] });
  });
});
describe('searchAll', () => {
  it('should search through all uploaded files', () => {
    expect(newIndex.searchAll('A alice hobbit scott fox'))
      .to.eql({ 'books.json':
      { a: [0, 1, 2],
        alice: [0],
        fox: ' We are Sorry but fox is not found in our database',
        hobbit: [1, 2],
        scott: ' We are Sorry but scott is not found in our database' },
        'books2.json':
        { a: [0, 1, 2],
          alice: ' We are Sorry but alice is not found in our database',
          fox: [1],
          hobbit: ' We are Sorry but hobbit is not found in our database',
          scott: [0] } });
  });
});

