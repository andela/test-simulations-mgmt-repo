const InvertedIndex = require('../Model/invertedIndex.js');
const test = require('../files/test.json');
const work = require('../files/work.json');
const empty = require('../files/empty.json');

const fileAPI = require('file-api');

const File = fileAPI.File;


const invertedIndex = new InvertedIndex();

const workBook = [{
  title: 'Checkpoint one',
  text: 'Testing getIndex function',
},

{
  title: 'Checkpoint Two',
  text: 'Coming soon',
},
];

describe('InvertedIndex : createIndex', () => {
  invertedIndex.createIndex('work.json', workBook);
  it('should verify that index has been created', () => {
    expect(Object.keys(invertedIndex.getIndex('work.json', workBook)).length)
      .toBeGreaterThan(0);
  });
  it('Should return an object that is an accurate index of the file uploaded',
    () => {
      expect(invertedIndex.getIndex('work.json', workBook)).toEqual({
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
});


describe('InvertedIndex : validateFile', () => {
  it('should return truthy if book data is valid',
    () => {
      expect(InvertedIndex.validateFile(workBook).status).toBeTruthy();
    });
  it('should return validate.msg if file uploaded is valid', () => {
    expect(InvertedIndex.validateFile(workBook).msg)
    .toBe('This is a valid File');
  });
  it('should return falsy if book is not an array of object literals', () => {
    expect(InvertedIndex.validateFile('theDojo').status).toBeFalsy();
    expect(InvertedIndex.validateFile(100).status).toBeFalsy();
  });
  it('should return validate.msg if file uploaded is empty', () => {
    expect(InvertedIndex.validateFile('Dojo').msg)
    .toBe('File is empty upload a file');
    expect(InvertedIndex.validateFile(100).msg)
    .toBe('File is empty upload a file');
  });
  it('should return validate.msg if file dosent contain title or text', () => {
    expect(InvertedIndex.validateFile(empty).msg).toBe('Invalid file content');
  });
});

describe('InvertedIndex : check type of InvertedIndex methods', () => {
  it('should check that the class has a createIndex method', () => {
    expect(typeof invertedIndex.createIndex).toBe('function');
  });

  it('should check that the class has a validateFile method', () => {
    expect(typeof InvertedIndex.validateFile).toBe('function');
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

  it('should check that the class has a searchIndex method', () => {
    expect(typeof invertedIndex.flattenSearch).toBe('function');
  });
});

describe('InvertedIndex : Read file data ', () => {
  it('should read and return the contents of a file via callback',
   (read) => {
     const file = new File('./files/test.json');
     InvertedIndex.readFile(file, (e) => {
       expect(JSON.parse(e.target.result)).toEqual(test);
       read();
     });
   });
});

describe('InvertedIndex : Tokenize words', () => {
  it('should return tokenized words for string in variable words', () => {
    let words = 'It CAN only BE++ $$$$$   GOD';
    const termsExpected = ['it', 'can', 'only', 'be', 'god'];
    words = invertedIndex.tokenize(words);
    expect(termsExpected).toEqual(words);
  });
});
