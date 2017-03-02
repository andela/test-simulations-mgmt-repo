
const invertedIndex = new InvertedIndex();
const mockData = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls rings.'
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of in the rings.'
  }
];


describe('INVERTED INDEX TEST', () => {
  describe('IT VALIDATES BOOK DATA', () => {
    it('should return validation status for the input file',
     () => {
       expect(invertedIndex.validateInput('rowland')).toBe(false);
       expect(invertedIndex.validateInput(2)).toBe(false);
       expect(invertedIndex.validateInput([1, 2, 3])).toBe(false);
       expect(invertedIndex.validateInput([{ sex: 'male', age: 18 }]))
       .toBe(false);
       expect(invertedIndex.validateInput([{ title: 67, text: 18 }]))
       .toBe(false);
       expect(invertedIndex.validateInput(mockData)).toBe(true);
     });
  });
  describe('RETURNS A CONCATENATED STRING', () => {
    it(`an object with a title and text property
    returns a string concatenating those two properties`,
     () => {
       const data = { title: 'Alice in wonderland',
         text: 'how did she get there abeg ?' };
       expect(invertedIndex.getBookText(data))
       .toBe('Alice in wonderland how did she get there abeg ?');
     });
  });
  describe('DOES NOT RETURN A CONCATENATED STRING', () => {
    it('for invalid book inputs',
     () => {
       expect(invertedIndex.getBookText([{ sex: 'male', age: 18 }]))
       .toBe(false);
       expect(invertedIndex.getBookText({ title: 'rage of, angels',
         type: [1, 2, 3] })).toBe(false);
     });
  });
  describe('RETURNS A STRING WITHOUT CHARACTERS AND ALL IN LOWER CASE',
   () => {
     it('should return a string all in lower cases', () => {
       expect(invertedIndex.generateToken('ABC.(D?RFG,HIJKL'))
       .toEqual(['abcdrfghijkl']);
       expect(invertedIndex.generateToken(`ALICE IN,
        WONDERLAND`)).toEqual(['alice', 'in', 'wonderland']);
     });
   });
  describe('RETURNS AN ARRAY OF NON-REPETING STRINGS', () => {
    it('should return an array of unique strings', () => {
      expect(invertedIndex.createUniqueWords(['alice',
        'alice'])).toEqual(['alice']);
      expect(invertedIndex.createUniqueWords(['alice', 'alice',
        'boy', 'girl', 'child', 'boy'])).toEqual(['alice',
          'boy', 'girl', 'child']);
    });
  });
  describe('RETURNS A BUILT INDEX', () => {
    it('should return "index built" when given valid data', () => {
      const data = [{ title: 'Alice', text: 'how' }, { title: 'Rings',
        text: 'how' }];
      expect(invertedIndex.buildIndex(data)).toBe('Index Built');
    });
  });
  describe('RETURN AN ARRAY FOR GIVEN SEARCH PARAMETERS', () => {
    it(`should take in a word and an indexed book and
     return matches for that word`, () => {
      const newData = [{ title: 'Jane the virgin', text: 'rowland in' }];
      invertedIndex.buildIndex(newData);
      expect(invertedIndex.searchIndex('the')).toEqual(
        ['Jane the virgin']);
      invertedIndex.buildIndex(mockData);
      expect(invertedIndex.searchIndex('the'))
      .toEqual(['Jane the virgin',
        'The Lord of the Rings: The Fellowship of the Ring.']);
    });
  });
});

