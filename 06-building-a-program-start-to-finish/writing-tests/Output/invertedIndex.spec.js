const alice = require('../books/alice.json');
const rabbits = require('../books/rabbits.json');
const wrongkeys = require('../books/wrongkeys.json');

describe('InvertedIndex Test Suite', () => {
  beforeAll(() => {
    this.invertedIndex = new InvertedIndex();
    this.invertedIndex.createIndex('alice', alice);
    this.invertedIndex.createIndex('rabbits', rabbits);
  });

  describe('InvertedIndex Class', () => {
    it('should be defined', () => {
      expect(InvertedIndex).toBeDefined();
    });

    it('should create inverted index instance', () => {
      expect(this.invertedIndex instanceof InvertedIndex).toBe(true);
    });

    it('should have object as the instance of invertedIndex', () => {
      expect(typeof this.invertedIndex).toEqual('object');
    });

    it('should have an indexed object to hold all indexes', () => {
      expect(typeof this.invertedIndex.indexed).toEqual('object');
    });
  });

  describe('The readFile method', () => {
    it('should read a file', () => {
      beforeEach(() => {
        const eventListener = jasmine.createSpy();
        var dummyFileReader = { addEventListener: eventListener };
        spyOn(window, "FileReader").and.returnValue(dummyFileReader)
      });
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const fileRead = reader.result;
        expect(fileRead).toBeTruthy();
        expect(JSON.parse(fileRead) instanceof Object).toBeTruthy();
        done();
      });
    });

    it('should call validateFile', () => {
      var reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const fileRead = reader.result
        expect(InvertedIndex.validateFile(fileRead)).toHaveBeenCalled;
        done();
     });
    });

    it('should return the json file if it is valid', () => {
      expect(InvertedIndex.readFile(alice)).toBeTruthy();
    });

    it('should return the false if the file cannot be parsed', () => {
      const readFile = InvertedIndex.readFile(alice);
      expect(typeof readFile).toEqual('object');
    });
  });

  describe('createIndex function', () => {
    it('should create an index for a valid file', () => {
      expect(this.invertedIndex.indexed.alice.numOfDocs).toBe(3);
      expect(typeof this.invertedIndex.indexed['rabbits'].eachWord)
        .toEqual('object');
    });

    it('should not create an index for a invalid file', () => {
      expect(this.invertedIndex.indexed.justwords).toBe(undefined);
    });
  });

  describe('getIndex function', () => {
    it('should return an index for an indexed file', () => {
      expect(this.invertedIndex.getIndex('alice')).toBeTruthy();
    });

    it('should not return an index for a file that is not indexed', () => {
      expect(this.invertedIndex.getIndex('wrongkeys')).toBeFalsy();
    });
  });

  describe('validateFile function', () => {
    it('should return false for a file that is not json', () => {
      const wrongKeysFile = InvertedIndex.validateFile(wrongkeys);
      expect(wrongKeysFile.success).toBe(false);
    });

    it('should return Object as type of validFile', () => {
      const validFile = InvertedIndex.validateFile(rabbits);
      expect(validFile.success).toBe(true);
    });
  });

  describe('tokenize function', () => {
    const words = 'Ralia, The Funk, And now: this is just Rowland';

    it('should return Object as type of validFile', () => {
      expect(InvertedIndex.tokenize(words)).toBeTruthy();
    });

    it('should return the correct array or words', () => {
      expect(InvertedIndex.tokenize(words))
        .toEqual(['ralia', 'the', 'funk', 'and', 'now', 'this', 'is', 
          'just', 'rowland']);
    });
  });

  describe('searchIndex function', () => {
    it('should return object as type of searchIndex for alice', () => {
      expect(this.invertedIndex.searchIndex('alice', 'alice') 
        instanceof Object).toBeTruthy();
    });

    it('should return object as type of searchIndex for rabbits', () => {
      expect(this.invertedIndex.searchIndex('rabbits', 'alice jump') 
        instanceof Object).toBeTruthy();
    });
  });
});
