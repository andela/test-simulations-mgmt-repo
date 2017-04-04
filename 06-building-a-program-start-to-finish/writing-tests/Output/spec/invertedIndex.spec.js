const Index = require('../Model/InvertedIndex');
const test = require('../files/test.json');
const work = require('../files/work.json');
const empty = require('../files/empty.json');

const fileAPI = require('file-api');

const File = fileAPI.File;


const invertedIndex = new Index();
invertedIndex.createIndex('work.json', work);

describe('InvertedIndex : createIndex', () => {
  it('should verify that index has been created', () => {
    expect(Object.keys(invertedIndex.getIndex('work.json', work)).length)
      .toBeGreaterThan(0);
  });
  it('Should return an object that is an accurate index of the file uploaded',
    () => {
      expect(invertedIndex.getIndex('work.json', work)).toEqual({
        checkpoint: [0, 1],
        one: [0],
        testing: [0],
        getindex: [0],
        function: [0],
        two: [1],
        coming: [1],
        soon: [1],
      });
    });
  it('should return falsy if file content is empty', () => {
    invertedIndex.createIndex('empty.json', empty);
    expect(Object.keys(invertedIndex.getIndex('empty.json', empty))
    .length < 1).toBeFalsy();
  });
});

describe('InvertedIndex : searchIndex', () => {
  it('Should return correct index of the search term in work.json', () => {
    expect(invertedIndex.searchIndex('soon', 'work.json')).toEqual({
      soon: [1],
    });
  });
  it('should return true if the constant is a string', () => {
    const words = 'Alice in Wonderland';
    expect(Object.keys(invertedIndex.searchIndex(words))).toBeTruthy();
  });
  it('Should return search for all files', () => {
    expect(Object.keys(invertedIndex.searchIndex('soon', 'work.json')))
       .toEqual(['soon']);
  });
  it('should search through all files', () => {
    invertedIndex.createIndex('test.json', test);
    expect(invertedIndex.searchIndex('soon movie', 'All files')).toEqual({
      'work.json': {
        soon: [1]
      },
      'empty.json': {},
      'test.json': {
        movie: [0, 1]
      }
    });
  });
});


describe('InvertedIndex : validateFile', () => {
  it('should return truthy if book data is valid',
    () => {
      expect(Index.validateFile(work).status).toBeTruthy();
    });
  it('should return validate.msg if file uploaded is valid', () => {
    expect(Index.validateFile(work).msg).toBe('This is a valid File');
  });
  it('should return falsy if book is not an array of object literals', () => {
    expect(Index.validateFile('theDojo').status).toBeFalsy();
    expect(Index.validateFile(100).status).toBeFalsy();
  });
  it('should return validate.msg if file uploaded is empty', () => {
    expect(Index.validateFile('Dojo').msg).toBe('File is empty upload a file');
    expect(Index.validateFile(100).msg).toBe('File is empty upload a file');
  });
  it('should return validate.msg if file dosent contain title or text', () => {
    expect(Index.validateFile(empty).msg).toBe('Invalid file content');
  });
});

describe('InvertedIndex : check type of InvertedIndex methods', () => {
  it('should check that the class has a createIndex method', () => {
    expect(typeof invertedIndex.createIndex).toBe('function');
  });

  it('should check that the class has a validateFile method', () => {
    expect(typeof Index.validateFile).toBe('function');
  });

  it('should check that the class has a tokenize method', () => {
    expect(typeof invertedIndex.tokenize).toBe('function');
  });

  it('should check that the class has a getIndex method', () => {
    expect(typeof invertedIndex.getIndex).toBe('function');
  });

  it('should check that the class has a searchIndex method', () => {
    expect(typeof invertedIndex.searchIndex).toBe('function');
  });
});

describe('InvertedIndex : Read file data ', () => {
  it('should read and return the contents of a file via callback',
   (read) => {
     const file = new File('./files/test.json');
     Index.readFile(file, (e) => {
       expect(JSON.parse(e.target.result)).toEqual(test);
       read();
     });
   });
});

describe('InvertedIndex : Tokenize words', () => {
  it('should return tokenized words for string in variable words', () => {
    let words = 'It CAN only BE++ $$$$$   [GOD]';
    const termsExpected = ['it', 'can', 'only', 'be', 'god'];
    words = invertedIndex.tokenize(words);
    expect(termsExpected).toEqual(words);
  });
});
