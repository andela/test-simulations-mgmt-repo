const newIndex = new InvertedIndex();

describe('Tests for the InvertedIndex class', () => {
  describe('The validateFile method', () => {
    it('should return error message for non-Array objects', () => {
      expect(() => { newIndex.createIndex('hello', 'Hello World'); })
          .toThrow(new Error(`This file's structure is invalid.
       Only array of objects are allowed.`));
      expect(() => { newIndex.createIndex('test', new Set(['a', 'the'])); })
          .toThrow(new Error(`This file's structure is invalid.
       Only array of objects are allowed.`));
      expect(() => { newIndex.createIndex('test', 200); })
          .toThrow(new Error(`This file's structure is invalid.
       Only array of objects are allowed.`));
    });

    it('returns contents of file if the file structure is valid', () => {
      expect(InvertedIndex.validateFile(testFile)).toEqual(testFile);
    });

    it('should throw error for invalid files', () => {
      expect(() => { InvertedIndex.validateFile(invalidTestFile); })
          .toThrow(new Error(`Your JSON file does not have the expected format.
          Documents are to have title and text keys alone.`));
    });
  });

  describe('The tokenize method', () => {
    it('should return a sorted array of words without non-letters', () => {
      const result = ['Alice', 'a', 'falls', 'hole', 'into', 'rabbit'];
      expect(InvertedIndex.tokenize(shortFile)).toEqual(result);
    });

    it('should return only words for words not separated by space', () => {
      const result = ['hello', 'boy', 'to', 'home'];
      expect(InvertedIndex.tokenize('hello.boy to-home')).toEqual(result);
    });

    it('only takes objects and strings as arguments', () => {
      expect(InvertedIndex.tokenize(1000)).toEqual([]);
    });
  });

  describe('The getTitles method', () => {
    it('should return the titles of documents in an array', () => {
      const result = ['Alice in Wonderland',
        'The Lord of the Rings: The Fellowship of the Ring.'];
      expect(InvertedIndex.getTitles(shortValidFile)).toEqual(result);
    });

    it('treats documents with the same name and content as one', () => {
      const result = ['Alice in Wonderland',
        'The Lord of the Rings: The Fellowship of the Ring.'];
      expect(InvertedIndex.getTitles(testFile)).toEqual(result);
    });

    it(`should include title in array if it has the same
     title as another but different text`, () => {
      const result = ['Alice in Wonderland',
        'The Lord of the Rings: The Fellowship of the Ring.',
        'The Lord of the Rings: The Fellowship of the Ring.'];
      expect(InvertedIndex.getTitles(noDuplicateText)).toEqual(result);
    });

    it(`should include title in array if it has the same
     text as another but different title name`, () => {
      const result = ['Alice in Wonderland',
        'The Lord of the Rings: The Fellowship of the Ring.',
        'The Lord of the Rings.'];
      expect(InvertedIndex.getTitles(noDuplicateTitles)).toEqual(result);
    });
  });

  describe('The createIndex method', () => {
    it('should return error message for files with improper key values', () => {
      const test = [
        {
          tite: 'Alice in Wonderland',
          text: 'Alice. falls- into@ a+ rabbit hole.',
        },
      ];

      expect(() => { newIndex.createIndex('doc1.json', invalidTestFile); })
        .toThrow(new Error(`Your JSON file does not have the expected format.
          Documents are to have title and text keys alone.`));
      expect(() => { newIndex.createIndex('test.json', test); })
        .toThrow(new Error(`Your JSON file does not have the expected format.
          Documents are to have title and text keys alone.`));
    });

    it('should return the correct indices for words in documents', () => {
      const result = { a: [0],
        alice: [0],
        alliance: [1],
        an: [1],
        elf: [1],
        falls: [0],
        hole: [0],
        into: [0],
        man: [1],
        of: [1],
        rabbit: [0],
        unusual: [1] };
      expect(newIndex.createIndex('doc.json', shortValidFile)['doc.json'][0])
      .toEqual(result);
    });

    it(`returns an object of key name and value of array of file indices,
     file name and file titles`, () => {
      const result = [{ a: [0],
        alice: [0],
        alliance: [1],
        an: [1],
        elf: [1],
        falls: [0],
        hole: [0],
        into: [0],
        man: [1],
        of: [1],
        rabbit: [0],
        unusual: [1] }, 'doc.json', ['Alice in Wonderland',
          'The Lord of the Rings: The Fellowship of the Ring.']];
      expect(newIndex.createIndex('doc.json', shortValidFile)['doc.json'])
      .toEqual(result);
    });

    it('should only accept an array of objects', () => {
      const testObject = {
        title: 'Alice in Wonderland',
        text: 'Alice. falls- into@ a+ rabbit hole.',
      };

      expect(() => { newIndex.createIndex('test.json', testObject); })
      .toThrow(new Error(`This file's structure is invalid.
       Only array of objects are allowed.`));
    });
  });

  describe('The lowerDocumentText method', () => {
    it('should turn the text field of documents to lower case', () => {
      InvertedIndex.lowerDocumentText(lowerDocumentFile);
      lowerDocumentFile.forEach((document) => {
        expect(document.text).toEqual(document.text.toLowerCase());
      });
    });

    it('only takes an array of objects as argument', () => {
      expect(() => { InvertedIndex.lowerDocumentFile({ a: 1 }); })
        .toThrowError(TypeError);
      expect(() => { InvertedIndex.lowerDocumentFile('Taiwo'); })
      .toThrowError(TypeError);
    });

    it(`should return the object passed to it
    with its text fields lower cased`, () => {
      const result = [
        {
          title: 'Alice in Wonderland',
          text: `alice falls into a rabbit hole and
     enters a world full of imagination.`,
        },
        {
          title: 'The Lord of the Rings: The Fellowship of the Ring.',
          text: `an unusual alliance of man, elf, dwarf, wizard
     and hobbit seek to destroy a powerful ring.`,
        },

        {
          title: 'The Lord of the Rings: The Fellowship of the Ring.',
          text: `an unusual alliance of man, elf, dwarf, wizard
     and hobbit seek to destroy a powerful ring.`,
        },
      ];
      expect(InvertedIndex.lowerDocumentText(lowerDocumentFile))
      .toEqual(result);
    });
  });

  describe('The searchIndex method', () => {
    const documentMock = { 'doc.json': [{ alice: [0],
      alliance: [1],
      an: [1],
      man: [1],
      hole: [0],
      a: [0],
      falls: [0],
      rabbit: [0],
      unusual: [1] }, ['Alice in Wonderland',
        'The Lord of the Rings: The Fellowship of the Ring.']] };

    it(`should return an object of words
     that appear in a single indexed file`, () => {
      const result = { alice: [0],
        alliance: [1],
        an: [1],
        man: [1],
        hole: [0],
        a: [0],
        falls: [0],
        rabbit: [0],
        unusual: [1] };
      expect(InvertedIndex.searchIndex('doc.json', 'alice,an,hole a man',
         documentMock)).toEqual(result);
    });

    it(`returns an object of file names against
    their search results for a search of all files`, () => {
      const allFilesResult = InvertedIndex.searchIndex('All Files',
      'alice,an,hole,a - man', allFilesMock);
      const result = { 'doc.json': {
        alice: [0],
        alliance: [1],
        an: [1],
        man: [1],
        hole: [0],
        a: [0],
        falls: [0],
        rabbit: [0],
        unusual: [1] },

        'test.json': { alice: [0],
          alliance: [1, 2],
          an: [1, 2],
          and: [0, 1, 2],
          man: [1, 2],
          hole: [0],
          a: [0, 1, 2],
          dwarf: [1, 2],
          falls: [0],
          imagination: [0],
          rabbit: [0],
          unusual: [1, 2],
          wizard: [1, 2] } };
      expect(allFilesResult).toEqual(result);
    });

    it('should take search string in any case and return result', () => {
      const result = {
        alice: [0],
        alliance: [1],
        an: [1],
        man: [1],
        hole: [0],
        a: [0],
        falls: [0],
        rabbit: [0],
        unusual: [1] };
      expect(InvertedIndex.searchIndex('doc.json', 'ALICE,AN,HOLE A MAN',
         documentMock)).toEqual(result);
    });

    it('should return words containing substring in search query', () => {
      const result = { alliance: [1],
        an: [1],
        man: [1] };
      expect(InvertedIndex.searchIndex('doc.json', 'an',
       documentMock)).toEqual(result);
    });
  });

  describe('The buildSearchResult method', () => {
    it('should build and return correct search result', () => {
      const result = { alice: [0],
        alliance: [1],
        an: [1],
        man: [1],
        hole: [0],
        a: [0],
        falls: [0],
        rabbit: [0],
        unusual: [1] };
      expect(InvertedIndex.buildSearchResult('doc.json', 'alice,an,hole a man',
         documentMock)).toEqual(result);
    });
  });
});
