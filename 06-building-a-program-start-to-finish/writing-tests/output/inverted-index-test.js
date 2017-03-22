const invertedIndex = new InvertedIndex();

const book = require('./book');
const News = require('./News');
const empty = require('./empty');
const likePackage = require('./likePackage');
const many = require('./many');

describe('Inverted index create method', () => {
  const result = invertedIndex.createIndex(book, 'book');
  const result2 = invertedIndex.createIndex(News, 'News');

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
    const searchForAliceInAllFiles = invertedIndex
    .searchFiles(['alice'], 'All');
    const searchForPartyInAllFiles = invertedIndex
    .searchFiles(['party'], 'All');
    const searchForAliceInBook = invertedIndex
    .searchFiles(['alice'], 'book');
    const searchForPartyInNews = invertedIndex
    .searchFiles(['party'], 'News');

    it('should return Object as type of search result', () => {
      expect(searchForAliceInAllFiles instanceof Object).toBeTruthy();
    });

    it('should match searchForAliceInAllFiles with alice: { 0: true }',
    () => {
      expect(searchForAliceInAllFiles.book).toEqual(jasmine.objectContaining({
        alice: { 0: true }
      }));
    });

    it('should match searchForAliceInAllFiles with alice: { 0: false }', () => {
      expect(searchForAliceInAllFiles.book).not
      .toEqual(jasmine.objectContaining({
        alice: { 0: false }
      }));
    });

    it('should matchsearchForPartyInAllFiles with party: { 0: true, 5: true }',
    () => {
      expect(searchForPartyInAllFiles.News).toEqual(jasmine.objectContaining({
        party: { 0: true, 5: true }
      }));
    });

    it('should match searchForPartyInAllFiles with party: { 0: true, 1: true }',
      () => {
        expect(searchForPartyInAllFiles.book).not
        .toEqual(jasmine.objectContaining({
          party: { 0: true, 1: true }
        }));
      });

    it('should return Object as type of searchResult3',
      () => {
        expect(searchForAliceInBook instanceof Object).toBeTruthy();
      });

    it('should match searchForAliceInBook with alice: { 0: true }', () => {
      expect(searchForAliceInBook.book).toEqual(jasmine.objectContaining({
        alice: { 0: true }
      }));
    });

    it('should match searchForAliceInBook with alice: { 0: false }',
      () => {
        expect(searchForAliceInBook.book).not.toEqual(jasmine.objectContaining({
          alice: { 0: false }
        }));
      });

    it('should return Object asype of searchResult4',
      () => {
        expect(searchForPartyInNews instanceof Object).toBeTruthy();
      });

    it('should match searchForPartyInNews with  party: { 0: true, 5: true }',
      () => {
        expect(searchForPartyInNews.News).toEqual(jasmine.objectContaining({
          party: { 0: true, 5: true }
        }));
      });
  });

  describe('the inverted index getIndex method', () => {
    const getCorrectBookIndex = invertedIndex.getIndex('book');
    const getEmptyIndex = invertedIndex.getIndex();
    it('should return object as typeof getCorrectBookIndex', () => {
      expect(getCorrectBookIndex instanceof Object).toBeTruthy();
    });

    it('should return false for getEmptyIndex', () => {
      expect(getEmptyIndex).toBeFalsy();
    });
  });

  describe('the inverted index validate method', () => {
    const emptyFileContent = invertedIndex.isValid(empty);
    const correctFileContent = invertedIndex.isValid(book[0]);
    const packageJsonBook = invertedIndex.isValid(likePackage);
    const manyBookContent = invertedIndex.isValid(many);

    it('should return false for an empty json file', () => {
      expect(emptyFileContent).toBeFalsy();
    });

    it('should return true for correctFileContent', () => {
      expect(correctFileContent).toBeTruthy();
    });

    it('should return false for pakage.json as book', () => {
      expect(packageJsonBook).toEqual(false);
    });

    it('should return false wrong file content', () => {
      expect(manyBookContent).toBeFalsy();
    });
  });

  describe('the inverted index normalizeText method', () => {
    const sampleSentence = 'Alice falls into a rabbit hole..';
    const normalizeTextTest = InvertedIndex.normalizeText(sampleSentence);

    it('should return true for normalizeTextTest', () => {
      expect(normalizeTextTest instanceof Array).toBeTruthy();
    });


    it('should return an array containing alphabets only', () => {
      expect(normalizeTextTest).toEqual(['alice',
        'falls', 'into', 'a', 'rabbit', 'hole']);
    });

    it('should return correct length of array of words', () => {
      expect(normalizeTextTest.length).toBe(6);
    });
  });
});
