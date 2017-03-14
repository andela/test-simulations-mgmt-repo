/* eslint-disable no-undef */
const invertedIndex = new InvertedIndex();
const file1 = require('../books/adventureBooks.json');
const file2 = require('../books/emptyBook.json');
const file3 = require('../books/wrongFormat.json');

const uploads = {
  'adventureBooks.json': { content: file1 },
  'emptyBook.json': { content: file2 },
  'wrongFormat.json': { content: file3 }
};

describe('helpers.fileIsValid function',
 () => {
   let goodFile1;
   let badFile1;
   let badFile2;
   let goodFile2;
   beforeEach(() => {
     goodFile1 = { name: 'book.json' };
     badFile1 = { name: 'book.css' };
     badFile2 = { name: 'book' };
     goodFile2 = { name: 'book.JSON' };
   });

   it('should return "true" for a valid json file when its is invoked', () => {
     expect(helpers.fileIsValid(goodFile1)).toBe(true);
     expect(helpers.fileIsValid(goodFile2)).toBe(true);
   });

   it('should return "false" for an invalid file when it is invoked', () => {
     expect(helpers.fileIsValid(badFile1)).toBe(false);
     expect(helpers.fileIsValid(badFile2)).toBe(false);
   });
 });

describe('helper.validateFileContents function',
 () => {
   let book3;
   let book4;
   beforeEach(() => {
     book3 = { boy: 'usman', girl: 'dammy' };
     book4 = 'this is the way we roll around here';
   });

   it('should return boolean when invoked with' +
   ' a valid json file input', () => {
     expect(typeof (helpers.validFileContent(
       uploads['adventureBooks.json'].content))).toBe('boolean');
   });

   it('should return true when invoked with' +
   ' a valid file contents', () => {
     expect(helpers.validFileContent(
       uploads['adventureBooks.json'].content)).toBe(true);
   });

   it('should return false when invoked with' +
   ' an invalid data format', () => {
     expect(helpers.validFileContent(
       uploads['wrongFormat.json'].content)).toBe(false);
     expect(helpers.validFileContent(book3)).toBe(false);
     expect(helpers.validFileContent(book4)).toBe(false);
   });
   it('should return false when invoked with' +
   ' an empty book', () => {
     expect(helpers.validFileContent([{}])).toBe(false);
   });
 });

describe('helper.mergeDocuments function',
 () => {
   let book1;
   beforeEach(() => {
     book1 = [['alice', 'enters'], ['fellowship', 'wizard'],
     ['thee', 'usuals']];
   });

   it('should return an array when it is invoked' +
   ' with a valid json file input', () => {
     expect((helpers.mergeDocuments(book1))
    instanceof Array).toBeTruthy();
   });

   it('should return "an array of comebined and sorted contents"' +
   ' when it is invoked with a valid book', () => {
     expect(helpers.mergeDocuments(book1)).toEqual(['alice', 'enters',
       'fellowship', 'thee', 'usuals', 'wizard']);
   });
 });
describe('helper.filterFileContent function',
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
     expect((helpers.filterFileContent(book1)) instanceof Array).toBeTruthy();
   });

   it('should return "an array of books with filtered contents"' +
   ' when it is invoked with a book', () => {
     expect(helpers.filterFileContent(book1)).toEqual(
       [['alice', 'enters', 'a'], ['fellowship', 'wizard', 'on'],
       ['thee', 'ee', 'un', 'usuals']]
       );
   });

   it('should return "an array of books with filtered contents"' +
    ' when it is invoked with books that contains' +
    ' only title and no text', () => {
     expect(helpers.filterFileContent(book2)).toEqual(
       [
         ['alice'],
        ['fellowship'],
       ['thee', 'ee']
       ]);
   });
 });

describe('helper.getTokens function',
 () => {
   it('should return "an array" when it is invoked with filterFileContent',
   () => {
     expect((helpers.getToken([['alice', 'hello', 'world'],
       ['alice', 'hello', 'world'], ['alice',
         'hello', 'world']])) instanceof Array).toBeTruthy();
   });

   it('should return "an array" of sorted non-repeated/unique tokens present' +
     ' in the filterFileContent it is invoked with', () => {
     expect(helpers.getToken([
       ['guy', 'alice', 'hello', 'world'],
       ['alice', 'hello', 'man', 'man', 'world'],
       ['alice', 'hello', 'world']]))
       .toEqual(['alice', 'guy', 'hello', 'man', 'world']);
   });
 });

describe('helper.removeDocDuplicates function',
 () => {
   it('should return " array " when invoked with' +
   ' filterFileContent', () => {
     expect((helpers.removeDocDuplicates([
       ['alice', 'alice', 'world'],
       ['hello', 'hello', 'world'],
       ['alice', 'world', 'world']])) instanceof Array)
       .toBeTruthy();
   });

   it('should return "an array of books with filtered contents" ' +
   'when it is invoked with a book that contains unfiltered content', () => {
     expect(helpers.removeDocDuplicates([
       ['alice', 'alice', 'world'],
       ['hello', 'hello', 'world'],
       ['alice', 'world', 'world']]))
       .toEqual([['alice', 'world'],
        ['hello', 'world'],
        ['alice', 'world']]);
   });
 });

describe('helper.removeDocDuplicates method',
 () => {
   it('should return " array " sorted non-repeated/unique tokens present' +
     ' in the filterFileContent', () => {
     expect(helpers.removeDuplicates(['alice', 'alice',
       'world']) instanceof Array).toBeTruthy();
   });

   it('should return "an array of books with filtered contents"' +
   ' when it is invoked with an unfiltered book', () => {
     expect(helpers.removeDuplicates(
       ['alice', 'alice', 'world'])).toEqual(['alice', 'world']);
   });
 });

describe('InvertedIndex class',
 () => {
   it('should create an instance of itself on instantiation',
  () => expect(invertedIndex instanceof InvertedIndex).toBeTruthy());
 });

describe('createIndex method',
 () => {
   it('should update the indexedFiles record when it is invoked', () => {
     expect(invertedIndex.createIndex(uploads, 'adventureBooks.json')).toEqual({
       'adventureBooks.json':
       { a: [true, true, false],
         alice: [true, false, false],
         alliance: [false, true, false],
         an: [false, true, false],
         and: [true, true, true],
         battles: [false, false, true],
         came: [false, false, true],
         contact: [false, false, true],
         destroy: [false, true, false],
         during: [false, false, true],
         dwarf: [false, true, false],
         elf: [false, true, false],
         enters: [true, false, false],
         falls: [true, false, false],
         fellowship: [false, true, false],
         fire: [false, false, true],
         full: [true, false, false],
         goblet: [false, false, true],
         harry: [false, false, true],
         his: [false, false, true],
         hobbit: [false, true, false],
         hole: [true, false, false],
         imagination: [true, false, false],
         in: [true, false, true],
         into: [true, false, false],
         lord: [false, true, false],
         man: [false, true, false],
         of: [true, true, true],
         persia: [false, false, true],
         potter: [false, false, true],
         powerful: [false, true, false],
         prince: [false, false, true],
         rabbit: [true, false, false],
         ring: [false, true, false],
         rings: [false, true, false],
         seek: [false, true, false],
         the: [false, true, true],
         to: [false, true, false],
         unusual: [false, true, false],
         with: [false, false, true],
         wizard: [false, true, false],
         wonderland: [true, false, false],
         world: [true, false, false]
       }
     }
     );
   });

   it('should return null for fake invertedIndex books format', () => {
     expect(invertedIndex.createIndex(uploads, 'wrongFormat.json')).toBe(null);
   });
   it('should return null for empty file', () => {
     expect(invertedIndex.createIndex(uploads, 'emptyBook.json')).toBe(null);
   });
 });

describe('searchIndex method',
 () => {
   let tokens;
   beforeEach(() => {
     tokens = ['alice', 'imagination', 'enters', 'powerful', 'usman'];
   });

   it('should return "object" when its type is checked', () => {
     expect(typeof (invertedIndex.searchIndex('adventureBooks.json', tokens)))
     .toBe('object');
   });

   it('should update the search record when it is invoked', () => {
     expect(invertedIndex.searchIndex('adventureBooks.json', tokens)).toEqual({
       'adventureBooks.json': {
         alice: [true, false, false],
         enters: [true, false, false],
         imagination: [true, false, false],
         powerful: [false, true, false],
         usman: [false, false, false]
       }
     });
   });
 });

