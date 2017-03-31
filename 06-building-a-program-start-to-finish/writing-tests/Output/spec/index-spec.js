const Index = require('../Model/inverted-index.js');
const invalidBook = require('../files/test.json');
const workBook = require('../files/work.json');
const empty = require('../files/empty.json');

const invertedIndex = new Index();

const work = [{
  title: 'Checkpoint one',
  text: 'Testing getIndex function',
},

{
  title: 'Checkpoint Two',
  text: 'Coming soon',
},
];

describe('Define methods for Index class', () => {
  invertedIndex.createIndex('work.json', workBook);
  it('Should ensure that invertedIndex methods are defined', () => {
    expect(invertedIndex.getIndex).toBeDefined();
  });
  it('Should ensure that invertedIndex methods are defined', () => {
    expect(invertedIndex.createIndex).toBeDefined();
  });
  it('Should ensure that invertedIndex methods are defined', () => {
    expect(invertedIndex.tokenize).toBeDefined();
  });
  it('Should ensure that invertedIndex methods are defined', () => {
    expect(Index.validateFile).toBeDefined();
  });
  it('Should ensure that invertedIndex methods are defined', () => {
    expect(invertedIndex.searchIndex).toBeDefined();
  });
});

describe('Should return an object that is an index of the file', () => {
  invertedIndex.createIndex('work.json', work);
  it('should verify that index has been created', () => {
    expect(Object.keys(invertedIndex.getIndex('work.json', work)).length)
      .toBeGreaterThan(0);
  });

  it('Should return an object that is an accurate index of the work.json file',
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
});
describe('Should create an object that is an accurate index of file', () => {
  invertedIndex.createIndex('test.json', invalidBook);
  it('should verify that index has been created', () => {
    expect(Object.keys(invertedIndex.getIndex('test.json', invalidBook)).length)
      .toBeGreaterThan(0);
  });

  it('Should create an object that is an accurate index of test.json file',
    () => {
      expect(invertedIndex.getIndex('test.json', invalidBook)).toEqual({
        honey: [0],
        i: [0],
        shrunked: [0],
        the: [0],
        kids: [0],
        an: [0],
        american: [0],
        movie: [0, 1],
        produced: [0],
        birds: [0],
        ant: [1],
        bully: [1],
        animated: [1],
        epic: [1],
        of: [1],
        ants: [1],
        bullying: [1],
        humans: [1],
      });
    });
});

describe('Search Index', () => {
  it('Should return correct index of the search term in work.json', () => {
    expect(invertedIndex.searchIndex('Testing, soon', 'work.json')).toEqual({
      testing: [0],
      soon: [1],
    });
  });
  it('should return true if search term is a string', () => {
    const words = 'Alice in Wonderland';
    expect(Object.keys(invertedIndex.searchIndex('words'))).toBeTruthy();
  });
  it('Should return correct index of the search term in test.json', () => {
    expect(invertedIndex.searchIndex('Honey, humans', 'test.json')).toEqual({
      honey: [0],
      humans: [1],
    });
  });
});

describe('Tokenize words', () => {
  it('should return tokenized words for terms', () => {
    let words = 'It CAN only BE++   GOD';
    const termsExpected = 'it can only be god';
    words = invertedIndex.tokenize(words);
    expect(termsExpected).toEqual(words);
  });
  it('should return tokenized words for terms', () => {
    let token = 'ALICE has GoNE to the maRKEt';
    const tokenExpected = 'alice has gone to the market';
    token = invertedIndex.tokenize(token);
    expect(tokenExpected).toEqual(token);
  });
});

describe('Validate File', () => {
  it('should return truthy if book data is valid',
    () => {
      expect(Index.validateFile(work).status).toBeTruthy();
    });
  it('should return truthy if book data is valid', () => {
    expect(Index.validateFile(workBook).status).toBeTruthy();
  });
  it('should return validate.msg if file uploaded is valid', () => {
    expect(Index.validateFile(workBook).msg).toBe('This is a valid File');
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

describe('InvertedIndex class, check all methods', () => {
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

  it('should check that the class has a searchIndex method', () => {
    expect(typeof invertedIndex.flattenSearch).toBe('function');
  });
});

