/* global describe, it, expect */
const valid1 = require('../../src/test books/valid1.json'),
      valid2 = require('../../src/test books/valid2.json'),
      valid3 = require('../../src/test books/valid3.json'),
      valid4 = require('../../src/test books/valid4.json'),
      invalid1 = require('../../src/test books/invalid1.json'),
      invalid2 = require('../../src/test books/invalid2.json'),
      invalid3 = require('../../src/test books/invalid3.json'),
      invalid4 = require('../../src/test books/invalid4.json'),
      invalid5 = require('../../src/test books/invalid5.json'),
      invalid6 = require('../../src/test books/invalid6.json'),
      invalid7 = require('../../src/test books/invalid7.json');

const valid3AsIndexed = { '777': [ 1 ], the: [ 0, 1 ], triumphant: [ 0 ],
                          church: [ 0 ], christians: [ 0 ], are: [ 0 ],
                          already: [ 0 ], victorious: [ 0 ], not: [ 0 ],
                          militant: [ 0 ], or: [ 0 ], defeated: [ 0 ],
                          written: [ 1 ], by: [ 1 ], a: [ 1 ], man: [ 1 ],
                          considered: [ 1 ], most: [ 1 ], wicked: [ 1 ],
                          that: [ 1 ], ever: [ 1 ], lived: [ 1 ],
                          allister: [ 1 ], crowley: [ 1 ]
                        }

const valid4AsIndexed = { testing: [ 0 ], could: [ 0, 1 ], be: [ 0, 1 ],
                          annoying: [ 0 ], when: [ 1 ], tests: [ 1 ],
                          pass: [ 1 ], fulfilling: [ 1 ], and: [ 1 ],
                          rewarding: [ 1 ] }

const textString = 'why are We *% \n so blind \t to see two-timers#@!`~-_+=/?";';
const tokenizedTextString = [ 'why', 'are', 'we', 'so', 'blind', 'to', 'see',
                              'two', 'timers' ];

const invertedIndex = new InvertedIndex();

describe('InvertedIndex', () => {
  
  describe('constructor', () => {
    it('should be an instance of  InvertedIndex', () => {
      expect(invertedIndex instanceof InvertedIndex).toBeTruthy();
      expect(typeof (invertedIndex)).toEqual('object');
    });

    it('should have defualt instatiated  values', () => {
      expect(invertedIndex.allIndexed).not.toBe(null);
      expect(invertedIndex.allTitles).not.toBe(null);
      expect(invertedIndex.documentsIndex).not.toBe(null);
      expect(invertedIndex.allIndexed).toEqual({});
      expect(invertedIndex.allTitles).toEqual({});
      expect(invertedIndex.documentsIndex).toEqual({});
      expect(invertedIndex.allIndexed).toBeDefined();
      expect(invertedIndex.allTitles).toBeDefined();
      expect(invertedIndex.documentsIndex).toBeDefined();
    });
  });

  describe('readFile', () => {
    it('should be defined', () => {
      expect(invertedIndex.readFile).not.toBeUndefined();
    });

    it('should be a function', () => {
      expect(typeof invertedIndex.readFile).toBe('function');      
    });
  });

  describe('tokenize', () => {
    it('should eliminate special characters, symbols and white spaces', () => {
      expect(invertedIndex.tokenize).not.toBeUndefined();
      expect(typeof invertedIndex.tokenize).toBe('function');
      expect(invertedIndex.tokenize(textString)).toEqual(tokenizedTextString);
    });
  });

  describe('createIndex', () => {
    it('should create indices properly', () => {
      expect(invertedIndex.createIndex).not.toBeUndefined();
      expect(typeof invertedIndex.createIndex).toBe('function');
      expect(invertedIndex.createIndex(valid3, 'valid3.json')).toEqual(valid3AsIndexed);
    });
  });

  describe('getIndex', () => {
    it('should get indices from already created ones', () => {
      invertedIndex.createIndex(valid3, 'valid3.json');
      expect(invertedIndex.getIndex).not.toBeUndefined();
      expect(typeof invertedIndex.getIndex).toBe('function');
      expect(invertedIndex.getIndex(valid3, 'valid3.json')).toEqual(valid3AsIndexed);
    });

    it('should create indices if file is not yet indexed', () => {
      expect(invertedIndex.getIndex(valid4, 'valid4.json')).toEqual(valid4AsIndexed);
    });
  });

  describe('validateFile', () => {
    it('should be defined and should be false if file is not an array', () => {
      expect(invertedIndex.validateFile).not.toBeUndefined();      
      expect(invertedIndex.validateFile(invalid1, 'invalid1.json')).toBeFalsy();
    });

    it('should be a function and should be false if file is not an array of objects', () => {
      expect(typeof invertedIndex.validateFile).toBe('function');      
      expect(invertedIndex.validateFile(invalid2, 'invalid2.json')).toBeFalsy();
    });

    it('should be false if file does not contain only "text" and "title" keys', () => {
      expect(invertedIndex.validateFile(invalid3, 'invalid3.json')).toBeFalsy();
      expect(invertedIndex.validateFile(invalid4, 'invalid4.json')).toBeFalsy();
      expect(invertedIndex.validateFile(invalid5, 'invalid5.json')).toBeFalsy();
    });

    it('should be false if file  "text" and "title" values are not Strings', () => {
      expect(invertedIndex.validateFile(invalid6, 'invalid6.json')).toBeFalsy();
      expect(invertedIndex.validateFile(invalid7, 'invalid7.json')).toBeFalsy();
    });

    it('should be true if files are formatted properly', () => {
      expect(invertedIndex.validateFile(valid1, 'valid1.json')).toBeTruthy();
      expect(invertedIndex.validateFile(valid2, 'valid2.json')).toBeTruthy();
    });
  });

  describe('searchIndex', () => {
    it('should be able to get indices of words from already indexed files', () => {
      invertedIndex.createIndex(valid3, 'valid3.json');
      invertedIndex.createIndex(valid4, 'valid4.json');

      expect(invertedIndex.searchIndex).not.toBeUndefined();
      expect(typeof invertedIndex.searchIndex).toBe('function');
      expect((invertedIndex.searchIndex('and', 'valid4.json'))[0].indexes.and).toEqual([1]);
      expect((invertedIndex.searchIndex('the', 'valid3.json'))[0].indexes.the).toEqual([ 0, 1 ]);
    });

    it('should be false if empty string is searched for', () => {
      invertedIndex.createIndex(valid3, 'valid3.json');
      expect(invertedIndex.searchIndex(' ', 'valid3.json')).toBe(false);
    });

    it('should be able to search for multiple words in one file', () => {
      invertedIndex.createIndex(valid1, 'valid1.json');

      expect((invertedIndex.searchIndex('and, the, that', 'valid1.json'))[0].indexes)
                            .toEqual({and: [ 0, 1 ], the: [ 0, 1, 2 ], that: [ 2 ]});
    });

    it('should be able to search for multiple words in multiple files', () => {
      invertedIndex.createIndex(valid1, 'valid1.json');
      invertedIndex.createIndex(valid2, 'valid2.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].indexes)
                            .toEqual({the: [ 0, 1, 2 ], that: [ 2 ], in: [ 0, 2 ]});

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].searchedFile)
                            .toEqual('valid1.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[2].title)
                            .toEqual(["The 'Alice' in Wonderland",
                                      "The Lord of the Rings: The Fellowship of the Ring.",
                                      "The Tower of Babel: Ancient History."]);

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].indexes)
                            .toEqual({the: [ 2 ], that: [ 0, 1, 2 ], in: undefined});  

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].searchedFile)
                            .toEqual('valid2.json');

      expect((invertedIndex.searchIndex('the, that, in', 'All'))[3].title)
                            .toEqual(["Trial and Error", "Sound of Music.", "Pfunky"]);                                                
    });
  });
});