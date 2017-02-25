const chai = require('chai');

const expect = chai.expect;

const InvertedIndex = require('../../src/js/inverted-index.js');
const books = require('../books.json');

const emptyBook = [];
const newIndex = new InvertedIndex();
const sampleData = ' Mary had a    little #$%^6 lamb, a little lamb Mary had';
newIndex.createIndex('books.json', books);

describe('Validate files', () => {
  it('should check that uploaded file is valid JSON', () => {
    expect(Array.isArray(books)).to.be.true;
    expect(Array.isArray(emptyBook)).to.be.true;
    expect(typeof books[0]).to.equal('object');
  });

  it('should not be empty', () => {
    expect(books.length).to.not.equal(0);
    expect(emptyBook.length).to.equal(0);
  });
  it("should have a valid 'title' and 'text'", () => {
    expect(books[0].title).to.not.be.undefined;
    expect(books[0].text).to.not.be.undefined;
  });
});
describe('createIndex class', () => {
  it('should be a class', () => {
    expect(newIndex instanceof InvertedIndex).to.be.true;
    expect(typeof (newIndex)).to.equal('object');
  });
});

describe('Normalized Text', () => {
  it('should be a method in InvertedIndex', () => {
    expect(InvertedIndex.normalizedText).to.be.defined;
  });
  it('should return an array containing only alphabets', () => {
    expect(InvertedIndex.normalizedText(sampleData)).to.not.include(' ');
    expect(InvertedIndex.normalizedText(sampleData)).to.not.include('#$%^6');
  });
  it('should return an array containing the correct number of words', () => {
    expect(InvertedIndex.normalizedText(sampleData).length).to.equal(10);
  });
});
describe('Unique words', () => {
  it('should be a method in InvertedIndex', () => {
    expect(InvertedIndex.uniqueWords).to.be.defined;
  });
  it('should not return any duplicate words', () => {
    expect(InvertedIndex.uniqueWords(sampleData).length).to.equal(5);
  });
});
describe('Read Book Data', () => {
  it('createIndex should be a method in InvertedIndex', () => {
    expect(InvertedIndex.createIndex).to.be.defined;
  });
  it('should check that JSON file is not empty', () => {
    expect(newIndex.createIndex('emptyBooks.json', emptyBook))
    .to.eql('JSON file is Empty');
    expect(newIndex.createIndex('Books.json', books))
    .to.not.eql('JSON file is Empty');
  });
});

describe('Populate index', () => {
  it('should create index once JSON file has been read', () => {
    expect(newIndex.indices.length).to.not.equal(0);
  });
  it('should map words to the correct document location', () => {
    expect(newIndex.indices['books.json'].fellowship).to.eql([1, 2]);
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
