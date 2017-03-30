const alice = require('../books/alice.json');
const rabbits = require('../books/rabbits.json');
// const justwords = require('../books/justwords.json');
// const notjson = require('../books/notjson.json');
// const testsplit = require('../books/testsplit.json');
// const wrongkeys = require('../books/wrongkeys.js');

describe('InvertedIndex Class', () => {
  beforeAll(() => {
    this.invertedIndex = new InvertedIndex();
  });

  describe('Constructor', () => {
    it('can create inverted index instance', () => {
      expect(typeof this.invertedIndex).toEqual('object');
      expect(this.invertedIndex instanceof InvertedIndex).toBe(true);
    });

    it('has an indexed object to hold all indexes', () => {
      expect(typeof this.invertedIndex.indexed).toEqual('object');
    });
  });


  describe('CreateIndex', () => {
    beforeAll(() => {
      this.invertedIndex.createIndex('alice', alice);
      this.invertedIndex.createIndex('rabbits', rabbits);
    });
    it('creates an index', () => {
      expect(this.invertedIndex.getIndex('alice')).toBeTruthy();
      expect(this.invertedIndex.getIndex('rabbits')).toBeTruthy();
    });

  });
});
