const invertedObject = new InvertedIndex();


const correctBook = require('./book.json');
const wrongBook = require('./wrongFormat.json');
const zeroLength = require('./length.json');
const book = require('./News');



describe('Inverted Index test Suit', () => {
  describe('Testing Inverted index create method', () => {
    const outputObject = invertedObject.createIndex(correctBook, 'correctBook');
    const outputObject2 = invertedObject.createIndex(book, 'book');

    it('should return Object as object type of outputObject', () => {
      expect(outputObject instanceof Object).toBeTruthy();
    });

    it('matches outputObject with the expect alice: { 0: true }', () => {
      expect(outputObject).toEqual(jasmine.objectContaining({
        alice: { 0: true }
      }));
    });

    it('matches outputObject with the expect alice: { 0: false }', () => {
      expect(outputObject).not.toEqual(jasmine.objectContaining({
        alice: { 0: false }
      }));
    });

    it('matches outputObject with the expect alice: { 0: false }', () => {
      expect(outputObject).toEqual(jasmine.objectContaining({
        of: { 0: true, 1: true }
      }));
    });

    it('matches outputObject with the expect party: { 0: true, 5: true }', () => {
      expect(outputObject2).toEqual(jasmine.objectContaining({
        party: { 0: true, 5: true }
      }));
    });

    it('matches outputObject with the expect party: { 0: true, 5: true }', () => {
      expect(outputObject2).not.toEqual(jasmine.objectContaining({
        party: { 0: true, 4: true }
      }));
    });

    const searchObject = invertedObject.searchFiles(['alice'], 'All');
    const searchObject2 = invertedObject.searchFiles(['party'], 'All');
    const searchObject3 = invertedObject.searchFiles(['alice'], 'correctBook');
    const searchObject4 = invertedObject.searchFiles(['party'], 'book');

    it('should return Object as object type of searchObject for All', () => {
      expect(searchObject instanceof Object).toBeTruthy();
    });

    it('matches searchObject with the expect alice: { 0: true }', () => {
      expect(searchObject.correctBook).toEqual(jasmine.objectContaining({
        alice: { 0: true }
      }));
    });

    it('matches searchObject with the expect alice: { 0: false }', () => {
      expect(searchObject.correctBook).not.toEqual(jasmine.objectContaining({
        alice: { 0: false }
      }));
    });

    it('matches searchObject2 with the expect party: { 0: true, 5: true }', () => {
      expect(searchObject2.book).toEqual(jasmine.objectContaining({
        party: { 0: true, 5: true }
      }));
    });

    it('matches searchObject2 with the expect party: { 0: true, 1: true }', () => {
      expect(searchObject2.book).not.toEqual(jasmine.objectContaining({
        party: { 0: true, 1: true }
      }));
    });

    it('should return Object as object type of searchObject for correctBook', () => {
      expect(searchObject3 instanceof Object).toBeTruthy();
    });

    it('matches searchObject3 with the expect alice: { 0: true }', () => {
      expect(searchObject3.correctBook).toEqual(jasmine.objectContaining({
        alice: { 0: true }
      }));
    });

    it('matches searchObject3 with the expect alice: { 0: false }', () => {
      expect(searchObject3.correctBook).not.toEqual(jasmine.objectContaining({
        alice: { 0: false }
      }));
    });

    it('should return Object as object type of searchObject for book', () => {
      expect(searchObject4 instanceof Object).toBeTruthy();
    });

    it('matches searchObject4 with the expect party: { 0: true, 5: true }', () => {
      expect(searchObject4.book).toEqual(jasmine.objectContaining({
        party: { 0: true, 5: true }
      }));
    });
  });
});
