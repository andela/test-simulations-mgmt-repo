const Index = require('../Model/inverted-index');
const invalidBook = require('../files/test.json');
const workBook = require('../files/work.json');

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
    expect(invertedIndex.validateFile).toBeDefined();
  });
  it('Should ensure that invertedIndex methods are defined', () => {
    expect(invertedIndex.searchIndex).toBeDefined();
  });
});

describe('Should return an object that is an accurate index of the work.json file', () => {
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
describe('Should create an object that is an accurate index of test.json file', () => {
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
    expect(Object.keys(invertedIndex.searchIndex('words', 'book.json'))).toBeTruthy();
  });
  it('Should return correct index of the search term in test.json', () => {
    expect(invertedIndex.searchIndex('Honey, birds, humans', 'test.json')).toEqual({
      honey: [0],
      birds: [0],
      humans: [1],
    });
  });
});

describe('Tokenize words', () => {
  it('should return tokenized words for terms', () => {
    let words = 'It CAN only BE+ GOD';
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
  it('should check that the contents of the file to be uploaded is valid',
    () => {
      expect(invertedIndex.validateFile(work)).toBeFalsy();
    });
  it('should return falsy if book data is an empty array', () => {
    expect(invertedIndex.validateFile([])).toBeFalsy();
  });
  it('should return falsy if book data is not an array of object literals', () => {
    expect(invertedIndex.validateFile('theDojo')).toBeFalsy();
    expect(invertedIndex.validateFile(100)).toBeFalsy();
  });
});

describe('InvertedIndex class, check all methods', () => {
  it('should check that the class has a createIndex method', () => {
    expect(typeof invertedIndex.createIndex).toBe('function');
  });

  it('should check that the class has a validateFile method', () => {
    expect(typeof invertedIndex.validateFile).toBe('function');
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
