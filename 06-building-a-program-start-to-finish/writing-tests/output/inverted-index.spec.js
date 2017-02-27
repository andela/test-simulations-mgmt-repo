

describe('Test suite for Inverted Index Class', () => {
  let InvertedIndexTest;
  beforeEach(() => {
    InvertedIndexTest = new InvertedIndex();
  });
  describe('Should test for the instance of InvertedIndexTest', () => {
    it('Should return true if InvertedIndexTest is an instance of Object', () => {
      expect(InvertedIndexTest instanceof Object).toBe(true);
    });
    it('Should return false if InvertedIndexTest is not an instance of Array', () => {
      expect(InvertedIndexTest instanceof Array).toBe(false);
    });
    it('Should return true if InvertedIndexTest is an instance of InvertedIndex class', () => {
      expect(InvertedIndexTest instanceof InvertedIndex).toBe(true);
    });
    it('Should return false if InvertedIndexTest is not an instance of FakeInvertedIndex class', () => {
      // FakeInvertedIndex is found in test-data.js
      expect(InvertedIndexTest instanceof FakeInvertedIndex).toBe(false);
    });
  });

  describe('Should test for validity of data', () => {
    it('should return true on valid json data', () => {
      // data is found in test-data.js
      expect(InvertedIndexTest.isValid(data)).toBe(true);
    });
    it('should return false on invalid json data', () => {
      // fake_data is found in test-data.js
      expect(InvertedIndexTest.isValid(fake_data)).toBe(false);
    });
    it('should return false on false for null', () => {
      expect(InvertedIndexTest.isValid(null)).toBe(false);
    });
    it('should return false on empty arguments', () => {
      expect(InvertedIndexTest.isValid()).toBe(false);
    });
    it('should return false on wrong format', () => {
      // f is found in test-data.js
      expect(InvertedIndexTest.isValid(f)).toBe(false);
    });
    it('should return false on  invalid arguments', () => {
      expect(InvertedIndexTest.isValid('A json file')).toBe(false);
      expect(InvertedIndexTest.isValid([])).toBe(false);
      expect(InvertedIndexTest.isValid(32323)).toBe(false);
    });
    it('should return false when title or text field is empty', () => {
      expect(InvertedIndexTest.isValid([{ title: 'Great', text: '' }])).toBe(false);
      expect(InvertedIndexTest.isValid([{ title: '', author: 'Scott Fizgerald', text: 'Gatsby and Daisy' }])).toBe(false);
    });
  });

  describe('Should generate index from data', () => {
    it('should return index from data', () => {
      // data is found in test-data.js
      // index is found in test-data.js
      expect(InvertedIndexTest.generateIndex(data)).toEqual(index);
    });
    it('Should return null for undefined and null argument', () => {
      expect(InvertedIndexTest.generateIndex()).toEqual(null);
      expect(InvertedIndexTest.generateIndex(null)).toEqual(null);
    });
    it('Should return null for non Array parameters', () => {
      expect(InvertedIndexTest.generateIndex({})).toEqual(null);
      expect(InvertedIndexTest.generateIndex(2323)).toEqual(null);
      expect(InvertedIndexTest.generateIndex('edge cases')).toEqual(null);
    });
    it('Should return null for invalid data structure', () => {
      // fake_data is found in test-data.js
      expect(InvertedIndexTest.generateIndex(fake_data)).toEqual(null);
    });
  });
  describe('Should search for data in a generated index', () => {
    it('should search the generated index', () => {
      // searchQueries is found in test-data.js
      // data is found in test-data.js
      // searchResults is found in test-data.js
      expect(InvertedIndexTest.search(searchQueries[0], InvertedIndexTest.generateIndex(data))).
      toEqual(searchResults[0]);
    });
    it('should search all the generated index', () => {
      // data is found in test-data.js
      // searchAll is found in test-data.js
      expect(InvertedIndexTest.searchAll('good penny knock', [
        { name: 'file1',
          data: InvertedIndexTest.generateIndex(data) }, 
        { name: 'file2', 
          data: InvertedIndexTest.generateIndex(data) }])).toEqual(search_all_result);
    });
  });
});
