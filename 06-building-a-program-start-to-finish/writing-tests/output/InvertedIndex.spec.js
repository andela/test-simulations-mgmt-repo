/* Dependencies declared globally */
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

/* Test Case For Class and Method Instantiation */
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
/* Test case for createIndex Method */
describe('InvertedIndex createIndex', () => {
  it('Should return true for creating Index', () => {
    const indexedBooks = invertedIndex.indexedBooks,
      fileName = 'books.json';
    invertedIndex.createIndex(fileName, myBook);
    expect(indexedBooks.includes(fileName)).toBeTruthy();
  });
});
/* Test case for searchIndex */
describe('InvertedIndex searchIndex', () => {
  it('Should return No file has been indexed yet if no index has been created',
    () => {
      const search = () => {
        invertedIndex.searchIndex('alice');
      };
      expect(search).toThrowError('Error: No file has been indexed yet');
    });

  it('Should return an empty array if token is not found', () => {
    invertedIndex.searchIndex('alive', ['books.json']);
    expect(invertedIndex.finalResult).toEqual(
      { 'books.json': Object({ alive: [] }) }
    );
  });

  it('Should return `please enter a keyword to search.` when keyword is empty',
    () => {
      const search = () => {
        invertedIndex.searchIndex();
      };
      expect(search).toThrowError('please enter a keyword to search.');
    });
/* Test case getIndex Method */
  describe('InvertedIndex getIndex Method', () => {
    it('Should return an object for the getIndex method', () => {
      expect(typeof getIndex).toBe('object');
    });

    it('Should return `alive` as the first token created', () => {
      const alltoken = Object.keys(getIndex);
      expect(alltoken[0]).toBe('alice');
    });
  });
/* Test case for readFile Method */
  describe('InvertedIndex readFile Method', () => {
    it('Should return `Alice in Wonderland` as first title of the book',
      (done) => {
        const readFile = InvertedIndex.readFile(jsonFile);
        readFile.then((res) => {
          expect(res[1][0].title).toBe('Alice in Wonderland');
          done();
        });
      });
  });
/* Test Case for tokenize Method */
  describe('InvertedIndex tokenize Method', () => {
    it('Should return an array of tokenize words', () => {
      expect(InvertedIndex.tokenize('alice%,monday,&tuesday#, ]]]]['))
        .toEqual(['alice', 'monday', 'tuesday']);
    });
  });
/* Test case for validateFile Method */
  describe('InvertedIndex validateFile Method', () => {
    it('Should return true for well formatted Files', () => {
      const book = JSON.stringify(myBook);
      expect(InvertedIndex.validateFile(book, 'books.json')).toBeTruthy();
    });

    it('Should throw an error for empty books', () => {
      const fileName = 'emptybook.json';
      const checkEmptyBook = () => {
        InvertedIndex.validateFile(emptyBook, fileName);
      };
      expect(checkEmptyBook)
      .toThrowError('emptybook.json is not well formatted');
    });

    it('Should throw an error for books that does not contain title or text',
      () => {
        const name = 'invalidBook.json';
        const invalidKey = () => {
          InvertedIndex.validateFile(invalidKeys, name);
        };
        expect(invalidKey).toThrowError(`${name} is not well formatted`);
      });

    it('Should throw an error for Non-JSON file', () => {
      const validate = () => {
        InvertedIndex.validateFile('result', 'sample.txt');
      };
      const error = 'sample.txt has an Invalid File extension, JSON only';
      expect(validate).toThrowError(error);
    });
  });
/* Test case for cleanValues Method */
  describe('InvertedIndex cleanValues Method', () => {
    it('Should return an array of clean keywords', () => {
      expect(
        InvertedIndex.cleanValues('How, are, you doing today')
      )
        .toEqual(
        ['how', 'are', 'you', 'doing', 'today']
        );
    });
  });
/* Test case for getResult Method */
  describe('InvertedIndex getResult Method', () => {
    it('Should return an object for the searchResult', () => {
      expect(invertedIndex.getResult('alice', ['books.json']))
        .toEqual({ alice: [0, 3] });
    });

    it('Should throw an error if keyword contains special characters', () => {
      const validInput = () => {
        invertedIndex.getResult('[[[[[[[[[[[]]]]]]]]]', ['books.json']);
      };
      expect(validInput).toThrow('Search for Aplhanumeric values only');
    });
  });
});

