const invertedObject = new InvertedIndex();


const correctBook = require('./book.json');
const wrongBook = require('./wrongFormat.json');
const zeroLength = require('./length.json');
const book = require('./News');
const emptyFile = require('./empty');
const rightFile = require('./rightBook');

describe('Inverted Index test Suit', () => {
  describe('Inverted index create method', () => {
    const result = invertedObject.createIndex(correctBook, 'correctBook');
    const result2 = invertedObject.createIndex(book, 'book');

    it('should return Object as typeof result', () => {
      expect(result instanceof Object).toBeTruthy();
    });

    it('should match result with alice: { 0: true }', () => {
      expect(result).toEqual(jasmine.objectContaining({
        alice: { 0: true }
      }));
    });

    it('should match result with alice: { 0: false }', () => {
      expect(result).not.toEqual(jasmine.objectContaining({
        alice: { 0: false }
      }));
    });

    it('should match result with alice: { 0: false }', () => {
      expect(result).toEqual(jasmine.objectContaining({
        of: { 0: true, 1: true }
      }));
    });

    it('should match resultt with party: { 0: true, 5: true }', () => {
      expect(result2).toEqual(jasmine.objectContaining({
        party: { 0: true, 5: true }
      }));
    });

    it('should match result with party: { 0: true, 5: true }', () => {
      expect(result2).not.toEqual(jasmine.objectContaining({
        party: { 0: true, 4: true }
      }));
    });

    describe('The inverted index search method', () => {
      const searchResult = invertedObject.searchFiles(['alice'], 'All');
      const searchResult2 = invertedObject.searchFiles(['party'], 'All');
      const searchResult3 = invertedObject.searchFiles(['alice'], 'correctBook');
      const searchResult4 = invertedObject.searchFiles(['party'], 'book');

      it('should return Object as type of search result', () => {
        expect(searchResult instanceof Object).toBeTruthy();
      });

      it('should match searchResult with alice: { 0: true }', 
      () => {
        expect(searchResult.correctBook).toEqual(jasmine.objectContaining({
          alice: { 0: true }
        }));
      });

      it('should match searchResult with alice: { 0: false }', () => {
        expect(searchResult.correctBook).not.toEqual(jasmine.objectContaining({
          alice: { 0: false }
        }));
      });

      it('should match searchResult2 with party: { 0: true, 5: true }', () => {
        expect(searchResult2.book).toEqual(jasmine.objectContaining({
          party: { 0: true, 5: true }
        }));
      });

      it('should match searchResult2 with party: { 0: true, 1: true }', 
      () => {
        expect(searchResult2.book).not.toEqual(jasmine.objectContaining({
          party: { 0: true, 1: true }
        }));
      });

      it('should return Object as type of searchResult3', 
      () => {
        expect(searchResult3 instanceof Object).toBeTruthy();
      });

      it('should match searchResult3 with alice: { 0: true }', () => {
        expect(searchResult3.correctBook).toEqual(jasmine.objectContaining({
          alice: { 0: true }
        }));
      });

      it('should match searchResult3 with alice: { 0: false }', 
      () => {
        expect(searchResult3.correctBook).not.toEqual(jasmine.objectContaining({
          alice: { 0: false }
        }));
      });

      it('should return Object asype of searchResult4', 
      () => {
        expect(searchResult4 instanceof Object).toBeTruthy();
      });

      it('should match searchResult4 with  party: { 0: true, 5: true }', 
      () => {
        expect(searchResult4.book).toEqual(jasmine.objectContaining({
          party: { 0: true, 5: true }
        }));
      });
    });

    describe('the inverted index getIndicies method', () => {
      const getIndeciesFile = invertedObject.getAllIndecies('correctBook')
      const getIndeciesFile2 = invertedObject.getAllIndecies()
      it('should return object as typeof getIndeciesFile', () => {
        expect(getIndeciesFile instanceof Object).toBeTruthy();
      }); 

      it('should return false for getAllIndecies2', () => {
        expect(getIndeciesFile2).toBeFalsy();
      }); 
    });

    describe('the inverted index validate method', () => {

      const emptyJsonFile = invertedObject.validateFileFunc(emptyFile);
      const rightBook = invertedObject.validateFileFunc(correctBook[0]);
      
      it('should return false for an empty json file', () => {
        expect(emptyJsonFile).toBeFalsy();
      });

      it('should return Object as type of rightBook', () => {
        expect(rightBook instanceof Object).toBeTruthy();
      }); 
    });
  });
});
