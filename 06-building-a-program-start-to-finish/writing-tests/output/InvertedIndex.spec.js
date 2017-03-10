const invertedIndex = new InvertedIndex();

describe('InvertedIndex class',
 () => {
   it('should create an instance of itself on instantiation',
  () => expect(invertedIndex instanceof InvertedIndex).toBeTruthy());
 });

describe('updateIndexedFilesRecords method',
 () => {
   let books;
   let file;
   let file2;
   beforeEach(() => {
     books = { 'touch.json': {
       content: [{ title: 'Alice , / ?', text: 'enters a a.' },
     { title: 'Fellowship )&* ...', text: 'wizard on on' },
     { title: 'Thee + = - ee', text: 'un un usuals' }] },
       'tests.json': {
         content: [{ cat: 'Alice , / ?', text: 'enters a a.' },
     { catter: 'Fellowship )&* ...', text: 'wizard on on' },
     { title: 'Thee + = - ee', text: 'un un usuals' }] }
     };
     file = 'touch.json';
     file2 = 'tests.json';
   });

   it('should update the indexedFiles record when it is invoked', () => {
     expect(invertedIndex.updateIndexedFilesRecords(books, file)).toEqual({
       'touch.json': { a: [true, false, false],
         alice: [true, false, false],
         ee: [false, false, true],
         enters: [true, false, false],
         fellowship: [false, true, false],
         on: [false, true, false],
         thee: [false, false, true],
         un: [false, false, true],
         usuals: [false, false, true],
         wizard: [false, true, false] }
     });
   });

   it('should return null for fake invertedIndex books format', () => {
     expect(invertedIndex.updateIndexedFilesRecords(books, file2)).toBe(null);
   });
 });

describe('createIndex method',
 () => {
   let firstContent;
   let secondContent;
   let filteredContents;
   beforeEach(() => {
     firstContent = ['hello', 'world'];
     secondContent = ['hello', 'bayo'];
     filteredContents = [firstContent, firstContent, secondContent];
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.createIndex(firstContent,
     filteredContents, invertedIndex.checkForIndex))).toBe('object');
   });

   it('should return an object map of tokens and their indexes' +
    ' when it is invoked', () => {
     expect(invertedIndex.createIndex(firstContent,
     filteredContents, invertedIndex.checkForIndex)).toEqual({
       hello: [true, true, true],
       world: [true, true, false]
     });
   });
 });

describe('searchIndex method',
 () => {
   let tokens;
   let indexx;
   beforeEach(() => {
     tokens = ['hello', 'world', 'alice', 'man'];
     indexx = {
       man: [true, false, false],
       hello: [true, true, false],
       indian: [true, false, true]
     };
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.searchIndex(tokens, indexx))).toBe('object');
   });

   it('should return an object with searched tokens' +
     ' and their indexes when it is invoked ',
    () => {
      expect(invertedIndex.searchIndex(tokens, indexx)).toEqual({
        hello: [true, true, false],
        world: [false, false, false],
        alice: [false, false, false],
        man: [true, false, false]
      });
    });
 });

describe('updateSearchResult method',
 () => {
   let tokens;
   let file;
   beforeEach(() => {
     tokens = ['alice', 'ee', 'enters'];
     file = 'touch.json';
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.updateSearchResult(file, tokens)))
     .toBe('object');
   });

   it('should update the search record when it is invoked', () => {
     expect(invertedIndex.updateSearchResult(file, tokens)).toEqual({
       'touch.json': {
         alice: [true, false, false],
         ee: [false, false, true],
         enters: [true, false, false]
       }
     });
   });
 });


describe('helpers.fileIsValid function',
 () => {
   let file1;
   let file2;
   let file3;
   let file4;
   beforeEach(() => {
     file1 = { name: 'book.json' };
     file2 = { name: 'book.css' };
     file3 = { name: 'book' };
     file4 = { name: 'book.JSON' };
   });

   it('should return "true" for a valid json file when its is invoked', () => {
     expect(helpers.fileIsValid(file1)).toBe(true);
     expect(helpers.fileIsValid(file4)).toBe(true);
   });

   it('should return "false" for an invalid file when it is invoked', () => {
     expect(helpers.fileIsValid(file2)).toBe(false);
     expect(helpers.fileIsValid(file3)).toBe(false);
   });
 });

describe('helper.validateFileContents function',
 () => {
   let book1;
   let book2;
   let book3;
   let book4;
   beforeEach(() => {
     book1 = [{ title: 'Alice , / ?', text: 'enters a a.' },
     { title: 'Fellowship )&* ...', text: 'wizard on on' },
     { title: 'Thee + = - ee', text: 'un un usuals' }];
     book2 = { men: 'kskkskskskkskskskksksk' };
     book3 = { boy: 'usman', girl: 'dammy' };
     book4 = 'this is the way we roll around here';
   });

   it('should return boolean when invoked with' +
   ' a valid json file input', () => {
     expect(typeof (helpers.validFileContent(book1))).toBe('boolean');
   });

   it('should return true when invoked with' +
   ' a valid file contents', () => {
     expect(helpers.validFileContent(book1)).toBe(true);
   });

   it('should return false when invoked with' +
   ' an invalid data format', () => {
     expect(helpers.validFileContent(book2)).toBe(false);
     expect(helpers.validFileContent(book3)).toBe(false);
     expect(helpers.validFileContent(book4)).toBe(false);
   });
   it('should return false when invoked with' +
   ' an empty book', () => {
     expect(helpers.validFileContent([{}])).toBe(false);
   });
 });

describe('helper.comebineAndSortArray function',
 () => {
   let book1;
   beforeEach(() => {
     book1 = [['alice', 'enters'], ['fellowship', 'wizard'],
     ['thee', 'usuals']];
   });

   it('should return an array when it is invoked' +
   ' with a valid json file input', () => {
     expect((helpers.comebineAndSortArrays(book1)) instanceof Array).toBeTruthy();
   });

   it('should return "an array of comebined and sorted contents"' +
   ' when it is invoked with a valid book', () => {
     expect(helpers.comebineAndSortArrays(book1)).toEqual(['alice', 'enters',
       'fellowship', 'thee', 'usuals', 'wizard']);
   });
 });
describe('helper.filterBookContents function',
 () => {
   let book1;
   let book2;
   beforeEach(() => {
     book2 = [{ title: 'Alice , / ?' },
     { title: 'Fellowship )&* ...' },
     { title: 'Thee + = - ee' }];
     book1 = [{ title: 'Alice , / ?', text: 'enters a a.' },
     { title: 'Fellowship )&* ...', text: 'wizard on on' },
     { title: 'Thee + = - ee', text: 'un un usuals' }];
   });

   it('should return " array " for a valid json file input', () => {
     expect((helpers.filterBookContents(book1)) instanceof Array).toBeTruthy();
   });

   it('should return "an array of books with filtered contents"' +
   ' when it is invoked with a book', () => {
     expect(helpers.filterBookContents(book1)).toEqual(
       [['alice', 'enters', 'a'], ['fellowship', 'wizard', 'on'],
       ['thee', 'ee', 'un', 'usuals']]
       );
   });

   it('should return "an array of books with filtered contents"' +
    ' when it is invoked with books that contains' +
    ' only title and no text', () => {
     expect(helpers.filterBookContents(book2)).toEqual(
       [['alice'], ['fellowship'],
       ['thee', 'ee']]
       );
   });
 });

describe('helper.getTokens function',
 () => {
   it('should return "an array" when it is invoked with filterBookContents',
   () => {
     expect((helpers.getToken([['alice', 'hello', 'world'],
       ['alice', 'hello', 'world'], ['alice',
         'hello', 'world']])) instanceof Array).toBeTruthy();
   });

   it('should return "an array" of sorted non-repeated/unique tokens present' +
     ' in the filterBookContents it is invoked with', () => {
     expect(helpers.getToken([['guy', 'alice', 'hello', 'world'], ['alice',
       'hello', 'man', 'man', 'world'], ['alice', 'hello',
         'world']])).toEqual(['alice', 'guy', 'hello', 'man', 'world']);
   });
 });

describe('helper.removeDuplicatesInArray function',
 () => {
   it('should return " array " when invoked with' +
   ' filterBookContents', () => {
     expect((helpers.removeDuplicatesInArray([['alice',
       'alice', 'world'], ['hello', 'hello', 'world'], ['alice',
         'world', 'world']])) instanceof Array).toBeTruthy();
   });

   it('should return "an array of books with filtered contents" ' +
   'when it is invoked with a book that contains unfiltered content', () => {
     expect(helpers.removeDuplicatesInArray([['alice', 'alice', 'world'],
       ['hello', 'hello', 'world'], ['alice', 'world',
         'world']])).toEqual([['alice', 'world'], ['hello', 'world'],
          ['alice', 'world']]);
   });
 });

describe('helper.removeDuplicatesInArray method',
 () => {
   it('should return " array " sorted non-repeated/unique tokens present' +
     ' in the filterBookContents', () => {
     expect(helpers.removeDuplicates(['alice', 'alice',
       'world']) instanceof Array).toBeTruthy();
   });

   it('should return "an array of books with filtered contents"' +
   ' when it is invoked with an unfiltered book', () => {
     expect(helpers.removeDuplicates(['alice', 'alice',
       'world'])).toEqual(['alice', 'world']);
   });
 });
