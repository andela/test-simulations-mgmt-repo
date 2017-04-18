
describe('InvertedIndex class', () => {
  beforeAll(() => {
    indexInstance = new InvertedIndex();
    validBook = [{ title: 'Welcome to Test Environment',
      text: 'Enjoy this file' }];
    books = [
      {
        title: 'Alice in Wonderland',
        text:
        'Alice falls into a rabbit hole and enters a world full of imagination.'
      },

      {
        title: 'The Lord of the Rings: The Fellowship of the Ring.',
        text: `An unusual alliance of man, elf, dwarf, 
          wizard and hobbit seek to destroy a powerful ring.`
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring.',
        text: `An unusual alliance of man, elf, dwarf, 
          wizard and hobbit seek to destroy a powerful ring.`
      }
    ];
    const anotherBook = [{
      title: 'Alice the Great',
      text:
        'There is no better way to greatness than not giving up'
    },

    {
      title: 'Are you there for Development',
      text: `I have tried so many times but it's been unyielding 
          but I have made up my mind to develop no matter the obstacle`
    }];
    indexInstance.createIndex(books, 'books');
    indexInstance.createIndex(anotherBook, 'anotherBook');
  });
  describe('InvertedIndex class', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof indexInstance.createIndex).toBe('function');
    });

    it('should check that the class has a readFile method', () => {
      expect(typeof InvertedIndex.readFile).toBe('function');
    });

    it('should check that the class has a validateFile method', () => {
      expect(typeof InvertedIndex.validateFile).toBe('function');
    });

    it('should check that the class has a tokenize method', () => {
      expect(typeof InvertedIndex.tokenize).toBe('function');
    });

    it('should check that the class has a getDocumentTokens method', () => {
      expect(typeof InvertedIndex.getDocumentTokens).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof indexInstance.getIndex).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof indexInstance.searchIndex).toBe('function');
    });

    it('should check that the class has a getSearchResults method', () => {
      expect(typeof indexInstance.getSearchResults).toBe('function');
    });

    it('should check that the class has a getDocuments method', () => {
      expect(typeof indexInstance.getDocuments).toBe('function');
    });
  });

  describe('Read File', () => {
    it('should return false for an invalid filename extension', () => {
      const file = { name: 'badfileextension.jpg' };
      const file1 = { name: 'badfileextension.jsona' };
      InvertedIndex.readFile(file).then((response) => {
        expect(response).toBeFalsy();
      });
      InvertedIndex.readFile(file1).then((response) => {
        expect(response).toBeFalsy();
      });
    });
  });

  describe('Create Index', () => {
    it('should return mapped indices to words in a JSON file', () => {
      const expectedResult =
        { alice: [0],
          falls: [0],
          into: [0],
          a: [0, 1, 2],
          rabbit: [0],
          hole: [0],
          and: [0, 1, 2],
          enters: [0],
          world: [0],
          full: [0],
          of: [0, 1, 2],
          imagination: [0],
          in: [0],
          wonderland: [0],
          an: [1, 2],
          unusual: [1, 2],
          alliance: [1, 2],
          man: [1, 2],
          elf: [1, 2],
          dwarf: [1, 2],
          wizard: [1, 2],
          hobbit: [1, 2],
          seek: [1, 2],
          to: [1, 2],
          destroy: [1, 2],
          powerful: [1, 2],
          ring: [1, 2],
          the: [1, 2],
          lord: [1, 2],
          rings: [1, 2],
          fellowship: [1, 2] };
      expect(indexInstance.filesIndexed.books.index)
        .toEqual(expectedResult);
    });
    it('should return false for file with no content', () => {
      const term = {};
      expect(indexInstance.createIndex(term, 'term')).toBeFalsy();
    });
  });
  describe('Search Index', () => {
    it('should search through single files that are indexed', () => {
      const requiredOutput = { alice: [0],
        and: [0, 1, 2],
        unusual: [1, 2],
        imagination: [0] };
      const searchTerm = indexInstance
        .searchIndex('Alice, and her unusual imagination', 'books');
      expect(Object.keys(searchTerm[0].indexes))
        .toEqual(Object.keys(requiredOutput));
      expect(searchTerm[0].indexes).toEqual(requiredOutput);
    });
    it('should return false for an empty String', () => {
      const term = '';
      expect(indexInstance.searchIndex(term, 'books'))
      .toBeFalsy();
    });
    it('should return an empty object for words not found', () => {
      const term = 'Aeroplane';
      const expectedOutput = indexInstance.searchIndex(term, 'books');
      expect(expectedOutput[0].indexes).toEqual({ });
    });
    it('should return appropriate result for when all files is selected',
    () => {
      const expectedOutput =
        [{ indexes: { alice: [0], the: [1, 2] },
          searchedFile: 'books',
          documents: [0, 1, 2] },
        { indexes: { alice: [0],
          is: [0],
          the: [0, 1] },
          searchedFile: 'anotherBook',
          documents: [0, 1] },
        { indexes: { },
          searchedFile: 'term',
          documents: [] }];
      expect(indexInstance
        .searchIndex('Alice is the', 'all')).toEqual(expectedOutput);
    });
  });

  describe('Tokenize words', () => {
    it('should strip out special characters from text in documents', () => {
      let excerpt = 'Alice l##$oves her ima&&gination?';
      const expectedTokens = ['alice', 'loves', 'her', 'imagination'];
      excerpt = InvertedIndex.tokenize(excerpt);
      expect(excerpt).toEqual(expectedTokens);
    });
  });

  describe('Get index', () => {
    it('should return the appropriate output for the given filename', () => {
      const filename = 'books';
      const expectedOutput = { alice: [0],
        falls: [0],
        into: [0],
        a: [0, 1, 2],
        rabbit: [0],
        hole: [0],
        and: [0, 1, 2],
        enters: [0],
        world: [0],
        full: [0],
        of: [0, 1, 2],
        imagination: [0],
        in: [0],
        wonderland: [0],
        an: [1, 2],
        unusual: [1, 2],
        alliance: [1, 2],
        man: [1, 2],
        elf: [1, 2],
        dwarf: [1, 2],
        wizard: [1, 2],
        hobbit: [1, 2],
        seek: [1, 2],
        to: [1, 2],
        destroy: [1, 2],
        powerful: [1, 2],
        ring: [1, 2],
        the: [1, 2],
        lord: [1, 2],
        rings: [1, 2],
        fellowship: [1, 2] };
      expect(indexInstance.getIndex(filename))
        .toEqual(expectedOutput);
    });
    it('should return false for an empty filename', () => {
      const filename = '';
      expect(indexInstance.getIndex(filename))
        .toBeFalsy();
    });
  });

  describe('Validate File', () => {
    it('should return false for incorrect document structure', () => {
      const term = [{ t1: 'Welcome home', text: 'This is really home' }];
      expect(InvertedIndex.validateFile(term, 'term')).toBeFalsy();
    });
    it('should return true for correct document structure', () => {
      const term = [{ title: 'Welcome home', text: 'This is really home' }];
      expect(InvertedIndex.validateFile(term, 'term')).toBeTruthy();
    });
  });

  describe('Get Document Tokens Data', () => {
    it('should return the approriate object for a given document',
    () => {
      const expectedOutput = { documentCount: 0,
        textTokens: ['welcome', 'this', 'is', 'a', 'test', 'document'] };
      const documentCount = 0;
      const term = [{ text: 'Welcome', title: 'This is a test document' }];
      expect(InvertedIndex
        .getDocumentTokens(term, documentCount)).toEqual(expectedOutput);
    });
  });

  describe('Get Document Data', () => {
    it('should return the appropriate array of documents for a given file',
    () => {
      const expectedOutput = [0, 1, 2];
      expect(indexInstance
        .getDocuments('books')).toEqual(expectedOutput);
    });
  });

  describe('Get Search result Data', () => {
    it('should return the appropriate result for tokens searched',
    () => {
      const words = 'Alice is a girl';
      const expectedOutput = { alice: [0], a: [0, 1, 2] };
      expect(indexInstance
      .getSearchResults(words, 'books')).toEqual(expectedOutput);
    });
  });

  describe('Get Contruct Index Data', () => {
    it('should return the appropriate indexed words for a given document',
    () => {
      const documentTokens = [{ documentCount: 0,
        textTokens: ['welcome', 'this', 'is', 'a', 'test', 'document'] }];
      const expectedOutput =
        { welcome: [0], this: [0], is: [0], a: [0], test: [0], document: [0] };
      expect(InvertedIndex.constructIndex(documentTokens))
        .toEqual(expectedOutput);
    });
  });
});
