/* My Test Setups */
/* global describe it expect */
/* global FileReader */
/* global File */
/* global InvertedIndex */
import myBook from './myBook.json';
import emptyBook from './emptyBook.json';
import invalidKeys from './invalidBook.json';

const invertedIndex = new InvertedIndex();
invertedIndex.createIndex('books.json', myBook);
const getIndex = invertedIndex.getIndex('books.json');
const jsonFile = new File([JSON.stringify(myBook)],
  'books.json', { type: 'application/json' });

/* My Suites */
describe('Class and Method Instantaion', () => {
  it('Should be instantiated with the new keyword', () => {
    const init = () => {
      InvertedIndex();
    };
    expect(init).toThrowError('Cannot call a class as a function');
  });

  it('Should contain the getIndex method', () => {
    expect(typeof invertedIndex.getIndex).toBe('function');
  });

  it('Should contain the createIndex method', () => {
    expect(typeof invertedIndex.createIndex).toBe('function');
  });

  it('Should contain the searchIndex method', () => {
    expect(typeof invertedIndex.searchIndex).toBe('function');
  });

  it('Should contain the readFile method', () => {
    expect(typeof InvertedIndex.readFile).toBe('function');
  });

  it('Should contain the tokenize method', () => {
    expect(typeof InvertedIndex.tokenize).toBe('function');
  });

  it('Should contain the validateFile method', () => {
    expect(typeof InvertedIndex.validateFile).toBe('function');
  });
});
describe('InvertedIndex createIndex', () => {
  it('Should return true for creating Index', () => {
    expect(invertedIndex.createIndex('books.json', myBook)).toBeTruthy();
  });

  it('Should return the numbers of books in a file', () => {
    const numOfBooks = invertedIndex.booksIndex('books.json');
    expect(numOfBooks.length).toEqual(6);
  });
});

describe('InvertedIndex searchIndex', () => {
  it('Should return `No file has been indexed yet', () => {
    const search = () => {
      invertedIndex.searchIndex('alice');
    };
    expect(search).toThrowError('Error: No file has been indexed yet');
  });

  it('Should return an empty if not found', () => {
    invertedIndex.searchIndex('alive', ['books.json']);
    expect(invertedIndex.finalResult).toEqual(
      { 'books.json': Object({ alive: [] }) }
      );
  });

  it('Should return `please enter a keyword to search.`', () => {
    const search = () => {
      invertedIndex.searchIndex();
    };
    expect(search).toThrowError('please enter a keyword to search.');
  });

  it('Should return an object for searchResult', () => {
    expect(invertedIndex.getResult('alice', ['books.json']))
      .toEqual({ alice: [0, 3] });
  });

  it('Should throw an error', () => {
    const validInput = () => {
      invertedIndex.getResult('[[[[[[[[[[[]]]]]]]]]', ['books.json']);
    };
    expect(validInput).toThrow('Search for Aplhanumeric values only');
  });
});

describe('InvertedIndex getIndex', () => {
  it('Should return an object for getIndex method', () => {
    expect(typeof getIndex).toBe('object');
  });

  it('Should return an alive as the first token', () => {
    const alltoken = Object.keys(getIndex);
    expect(alltoken[0]).toBe('alice');
  });
});

describe('InvertedIndex readFile', () => {
  it('Should return an array for the JSON File', (done) => {
    const readFile = InvertedIndex.readFile(jsonFile);
    readFile.then((res) => {
      expect(res[1][0].title).toBe('Alice in Wonderland');
      done();
    });
  });
});

describe('InvertedIndex tokenize', () => {
  it('Should return array of tokenize words', () => {
    expect(InvertedIndex.tokenize('alice-,monday,&tuesday#, ]]]]['))
    .toEqual(['alice', 'monday', 'tuesday']);
  });
});

describe('InvertedIndex validateFile', () => {
  it('Should return true for well formatted File', () => {
    const book = JSON.stringify(myBook);
    expect(InvertedIndex.validateFile(book, 'books.json')).toBeTruthy();
  });

  it('Should throw an error for empty books', () => {
    const fileName = 'emptybook.json';
    const checkEmptyBook = () => {
      InvertedIndex.validateFile(emptyBook, fileName);
    };
    expect(checkEmptyBook).toThrowError('emptybook.json is not well formatted');
  });

  it('Should throw an error for Invalid keys', () => {
    const name = 'invalidBook.json';
    const invalidKey = () => {
      InvertedIndex.validateFile(invalidKeys, name);
    };
    expect(invalidKey).toThrowError(`${name} is not well formatted`);
  });

  it('Should return throw an error for Invalid file Extension', () => {
    const validate = () => {
      InvertedIndex.validateFile('result', 'sample.txt');
    };
    const error = 'sample.txt has an Invalid File extension, JSON only';
    expect(validate).toThrowError(error);
  });
});

describe('InvertedIndex cleanValues', () => {
  it('Should return an array of clean values', () => {
    expect(InvertedIndex.cleanValues('How, are, you doing today'))
      .toEqual(['how', 'are', 'you', 'doing', 'today']);
  });
});
