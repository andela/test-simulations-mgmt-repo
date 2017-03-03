describe('Test if the object exist and new instances can be created from it',
 () => {
   let invertedIndex;
   beforeEach(() => {
     invertedIndex = new InvertedIndex();
   });

   it('should return "function" when its type is checked', () => {
     expect(typeof (InvertedIndex)).toEqual('function');
   });

   it('should create an object once the class is declared', () => {
     expect(invertedIndex).toEqual(jasmine.any(Object));
   });

   it('should create an instance of itself once its attached to the' +
  '"new" key word',
  () => {
    expect(invertedIndex instanceof InvertedIndex).toBeTruthy();
  });
 });

describe('Test the check for index functionality',
 () => {
   let firstContent; let secondContent; let filteredContents;
   let invertedIndex; let wordMap; let word, word2, word3;
   beforeEach(() => {
     wordMap = {};
     word = 'hello';
     word2 = 'usman';
     word3 = 'world';
     invertedIndex = new InvertedIndex();
     firstContent = ['hello', 'world'];
     secondContent = ['hello', 'bayo'];
     filteredContents = [firstContent, firstContent, secondContent];
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.checkForIndex(word,
     filteredContents, wordMap))).toBe('object');
   });

   it('should return an object with search word matched with' +
    'an array of true if the word is found in all documents', () => {
     expect(invertedIndex.checkForIndex(word,
     filteredContents, wordMap)).toEqual({
       hello: [true, true, true] });
   });
   it('should return an object with search word matched with' + 
    'an array of "false" if the word is not found in all documents', () => {
     expect(invertedIndex.checkForIndex(word2,
     filteredContents, wordMap)).toEqual({
       usman: [false, false, false] });
   });
   it('should return an object with search word matched with' + 
   'an array of boolean with false if present in a document'+ 
   'and true if otherwise', () => {
     expect(invertedIndex.checkForIndex(word3,
     filteredContents, wordMap)).toEqual({
       world: [true, true, false] });
   });
 });

describe('Test the create index functionality',
 () => {
   let firstContent; let secondContent; let filteredContents;
   let invertedIndex;
   beforeEach(() => {
     invertedIndex = new InvertedIndex();
     firstContent = ['hello', 'world'];
     secondContent = ['hello', 'bayo'];
     filteredContents = [firstContent, firstContent, secondContent];
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.createIndex(firstContent,
     filteredContents, invertedIndex.checkForIndex))).toBe('object');
   });

   it('should create an object once the class is declared', () => {
     expect(invertedIndex.createIndex(firstContent,
     filteredContents, invertedIndex.checkForIndex)).toEqual({
       hello: [true, true, true],
       world: [true, true, false] });
   });
 });

describe('Test the search index functionality',
 () => {
   let tokens; let indexx;
   let invertedIndex;
   beforeEach(() => {
     invertedIndex = new InvertedIndex();
     tokens = ['hello', 'world', 'alice', 'man'];
     indexx = { man: [true, false, false],
       hello: [true, true, false],
       indian: [true, false, true] };
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.searchIndex(tokens, indexx))).toBe('object');
   });

   it('should return an array of objects with tokens and their indexs ', () => {
     expect(invertedIndex.searchIndex(tokens, indexx)).toEqual({
       hello: [true, true, false],
       world: [false, false, false],
       alice: [false, false, false],
       man: [true, false, false] });
   });
 });


describe('utility.fileIsValid',
 () => {
   let file1; let file2; let file3; let file4; let utility;
   beforeEach(() => {
     utility = new Helpers();
     file1 = { name: 'book.json' }; file2 = { name: 'book.css' };
     file3 = { name: 'book' }; file4 = { name: 'book.JSON' };
   });

   it('should return "true" for a valid json file', () => {
     expect(utility.fileIsValid(file1)).toBe(true);
     expect(utility.fileIsValid(file4)).toBe(true);
   });

   it('should return "false" for an invalid file', () => {
     expect(utility.fileIsValid(file2)).toBe(false);
     expect(utility.fileIsValid(file3)).toBe(false);
   });
 });

describe('validateFileContents',
 () => {
   let book1, book2, book3, book4; let utility;
   beforeEach(() => {
     utility = new Helpers();
     book1 = [{ title: 'Alice , / ?', text: 'enters a a.' },
     { title: 'Fellowship )&* ...', text: 'wizard on on' },
     { title: 'Thee + = - ee', text: 'un un usuals' }];
     book2 = { men: 'kskkskskskkskskskksksk' };
     book3 = { boy: 'usman', girl: 'dammy' };
     book4 = 'this is the way we roll around here';
   });

   it('should return boolean for a valid json file input', () => {
     expect(typeof (utility.validFileContent(book1))).toBe('boolean');
   });

   it('should return true for valid file contents', () => {
     expect(utility.validFileContent(book1)).toBe(true);
   });

   it('should return false for an invalid data format', () => {
     expect(utility.validFileContent(book2)).toBe(false);
     expect(utility.validFileContent(book3)).toBe(false);
     expect(utility.validFileContent(book4)).toBe(false);
   });
   it('should return false for an empty book', () => {
     expect(utility.validFileContent([{}])).toBe(false);
   });
 });

describe('comebineAndSortArray',
 () => {
   let book1; let utility;
   beforeEach(() => {
     utility = new Helpers();
     book1 = [['alice', 'enters'], ['fellowship', 'wizard'],
     ['thee', 'usuals']];
   });

   it('should return " array " for a valid json file input', () => {
     expect(typeof (utility.comebineAndSortArrays(book1))).toBe(typeof ([]));
   });

   it('should return "an array of comebined and sorted contents"', () => {
     expect(utility.comebineAndSortArrays(book1)).toEqual(['alice', 'enters',
       'fellowship', 'thee', 'usuals', 'wizard']);
   });
 });
describe('filterBookContents',
 () => {
   let book1; let utility; let book2;
   beforeEach(() => {
     utility = new Helpers();
     book2 = [{ title: 'Alice , / ?' },
     { title: 'Fellowship )&* ...' },
     { title: 'Thee + = - ee' }];
     book1 = [{ title: 'Alice , / ?', text: 'enters a a.' },
     { title: 'Fellowship )&* ...', text: 'wizard on on' },
     { title: 'Thee + = - ee', text: 'un un usuals' }];
   });

   it('should return " array " for a valid json file input', () => {
     expect(typeof (utility.filterBookContents(book1))).toBe(typeof ([]));
   });

   it('should return "an array of books with filtered contents"', () => {
     expect(utility.filterBookContents(book1)).toEqual(
       [['alice', 'enters', 'a'], ['fellowship', 'wizard', 'on'],
       ['thee', 'ee', 'un', 'usuals']]);
   });

   it('should return "an array of books with filtered contents"' +
    'for books with only title and no text', () => {
     expect(utility.filterBookContents(book2)).toEqual(
       [['alice'], ['fellowship'],
       ['thee', 'ee']]);
   });
 });

describe('getTokens',
 () => {
   let utility;
   beforeEach(() => {
     utility = new Helpers();
   });
   it('should return " array " sorted non-repeated/unique tokens present' +
     'in the filterBookContents', () => {
     expect(typeof (utility.getToken([['alice', 'hello', 'world'],
       ['alice', 'hello', 'world'], ['alice',
         'hello', 'world']]))).toBe(typeof ([]));
   });

   it('should return "an array of books with filtered contents"', () => {
     expect(utility.getToken([['guy', 'alice', 'hello', 'world'], ['alice',
       'hello', 'man', 'man', 'world'], ['alice', 'hello',
         'world']])).toEqual(['alice', 'guy', 'hello', 'man', 'world']);
   });
 });

describe('removeDuplicatesInArray',
 () => {
   let utility;
   beforeEach(() => {
     utility = new Helpers();
   });
   it('should return " array " sorted non-repeated/unique tokens present' +
     'in the filterBookContents', () => {
     expect(typeof (utility.removeDuplicatesInArray([['alice',
       'alice', 'world'], ['hello', 'hello', 'world'], ['alice',
         'world', 'world']]))).toBe(typeof ([]));
   });

   it('should return "an array of books with filtered contents"', () => {
     expect(utility.removeDuplicatesInArray([['alice', 'alice', 'world'],
       ['hello', 'hello', 'world'], ['alice', 'world',
         'world']])).toEqual([['alice', 'world'], ['hello', 'world'],
          ['alice', 'world']]);
   });
 });

describe('removeDuplicatesInArray',
 () => {
   let utility;
   beforeEach(() => {
     utility = new Helpers();
   });
   it('should return " array " sorted non-repeated/unique tokens present' +
     'in the filterBookContents', () => {
     expect(typeof (utility.removeDuplicates(['alice', 'alice',
       'world']))).toBe(typeof ([]));
   });

   it('should return "an array of books with filtered contents"', () => {
     expect(utility.removeDuplicates(['alice', 'alice',
       'world'])).toEqual(['alice', 'world']);
   });
 });
