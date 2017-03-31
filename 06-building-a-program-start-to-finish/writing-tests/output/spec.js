/* My Test Setups */
/* global describe it expect */
import myBook from './books.json';
import emptyBook from './emptyBook.json';
import invalidKeys from './Invalidkeys.json';

/* My Suites */
describe('Class and Method Instantaion', () => {
  const myClass = new InvertedIndex();

  it('Should be instantiated with the new keyword', () => {
    const init = () => {
      InvertedIndex();
    };
    expect(init).toThrowError('Cannot call a class as a function');
  });

  it('Should contain the getIndex method', () => {
    expect(typeof myClass.getIndex).toBe('function');
  });

  it('Should contain the createIndex method', () => {
    expect(typeof myClass.createIndex).toBe('function');
  });

  it('Should contain the searchIndex method', () => {
    expect(typeof myClass.searchIndex).toBe('function');
  });

  it('Should contain the readFile method', () => {
    expect(typeof myClass.readFile).toBe('function');
  });

  it('Should contain the tokenize method', () => {
    expect(typeof InvertedIndex.tokenize).toBe('function');
  });

  it('Should contain the validateFile method', () => {
    expect(typeof InvertedIndex.validateFile).toBe('function');
  });
});

describe('Populating Data', () => {
  const myClass = new InvertedIndex();
  myClass.createIndex('books.json', myBook);
  const getIndex = myClass.getIndex('books.json');
  const jsonFile = new File([JSON.stringify(myBook)],
    'books.json', { type: 'application/json' });
  it('Should return true for creating Index', () => {
    expect(myClass.createIndex('books.json', myBook)).toBeTruthy();
  });

  it('Should return `No file has been indexed yet', () => {
    const search = () => {
      myClass.searchIndex('alice');
    };
    expect(search).toThrowError();
  });

  it('Should return `please enter a keyword to search.`', () => {
    const search = () => {
      myClass.searchIndex();
    };
    expect(search).toThrowError('please enter a keyword to search.');
  });

  it('Should return true for well formatted File', () => {
    const book = JSON.stringify(myBook);
    expect(InvertedIndex.validateFile(book, 'books.json')).toBeTruthy();
  });

  it('Should throw an error for empty books', () => {
    const name = 'emptybook.json';
    const checkEmptyBook = () => {
      InvertedIndex.validateFile(emptyBook, name);
    };
    expect(checkEmptyBook).toThrowError();
  });

  it('Should throw an error for Invalid keys', () => {
    const name = 'invalidKeys.json';
    const invalidKey = () => {
      InvertedIndex.validateFile(invalidKeys, name);
    };
    expect(invalidKey).toThrowError(`OOPS!!! ${name} is not well formatted`);
  });

  it('Should return an object for getIndex method', () => {
    expect(typeof getIndex).toBe('object');
  });

  it('Should return an alive as the first token', () => {
    const alltoken = Object.keys(getIndex);
    expect(alltoken[0]).toBe('alive');
  });

  it('Should return the numbers of books in a file', () => {
    const numOfBooks = myClass.getNumOfBooks('books.json');
    expect(numOfBooks.length).toEqual(5);
  });

  it('Should return an array for the JSON File', (done) => {
    const readFile = myClass.readFile(jsonFile);
    readFile.then((res) => {
      expect(res[1][0].title).toBe('Alive on Wonderland');
      done();
    });
  });

  it('Should return throw an error for Invalid file Extension', () => {
    const validate = () => {
      InvertedIndex.validateFile('result', 'sample.txt');
    };
    const error = 'sample.txt has an Invalid File extension, JSON only';
    expect(validate).toThrowError(error);
  });

  it('Should return an array of clean values', () => {
    expect(InvertedIndex.cleanValues('How, are, you doing today'))
    .toEqual(['how', 'are', 'you', 'doing', 'today']);
  });
});
