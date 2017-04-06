const newIndex = new InvertedIndex();

describe('Tests for the InvertedIndex class', () => {
  localStorage.indexedDocs = JSON.stringify({});

  describe('Tests for the validateFile method', () => {
    it('returns contents of file if the file structure is valid', () => {
      expect(newIndex.validateFile(testFile)).toEqual(testFile);
    });

    it('should throw error for invalid files', () => {
      expect(() => { newIndex.validateFile(invalidTestFile); })
          .toThrow(new Error(`Your JSON file does not have the expected format.
          Documents are to have title and text keys alone.`));
    });
  });

  describe('Tests for the tokenize method', () => {
    it('should return a sorted array of words without non-letters', () => {
      const result = ['Alice', 'a', 'falls', 'hole', 'into', 'rabbit'];
      expect(newIndex.tokenize(shortFile)).toEqual(result);
    });

    it('should return only words for words not separated by space', () => {
      const result = ['hello', 'boy', 'to', 'home'];
      expect(newIndex.tokenize('hello.boy to-home')).toEqual(result);
    });

    it('only takes objects and strings as arguments', () => {
      expect(newIndex.tokenize(1000)).toEqual([]);
    });
  });

  describe('Tests for the getTitles method', () => {
    it('should return the titles of documents in an array', () => {
      const result = ['Alice in Wonderland',
       'The Lord of the Rings: The Fellowship of the Ring.'];
      expect(newIndex.getTitles(shortFile2)).toEqual(result);
    });

    it('treats documents with the same name and content as one', () => {
      const result = ['Alice in Wonderland', 'The Lord of the Rings: The Fellowship of the Ring.'];
      expect(newIndex.getTitles(testFile)).toEqual(result);
    });

    it('should append " - Copy" to title if title already exists but has different text', () => {
      const result = ['Alice in Wonderland',
      'The Lord of the Rings: The Fellowship of the Ring.',
      'The Lord of the Rings: The Fellowship of the Ring. - Copy'];
      expect(newIndex.getTitles(testFile3)).toEqual(result);
    });

    it('should include title in array if it has the same text as another but different title name', () => {
      const result = ['Alice in Wonderland',
       'The Lord of the Rings: The Fellowship of the Ring.',
        'The Lord of the Rings.'];
      expect(newIndex.getTitles(testFile2)).toEqual(result);
    });
  });

  describe('Tests for the createIndex method', () => {
    it('should return error message for non-Array objects', () => {
      expect(() => { newIndex.createIndex('hello', 'Hello World'); })
          .toThrow(new Error('This file\'s structure is ' +
          'invalid. Only array of objects are allowed.'));
      expect(() => { newIndex.createIndex('test', new Set(['a', 'the'])); })
          .toThrow(new Error('This file\'s structure is ' +
          'invalid. Only array of objects are allowed.'));
      expect(() => { newIndex.createIndex('test', 200); })
          .toThrow(new Error('This file\'s structure is ' +
          'invalid. Only array of objects are allowed.'));
    });

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
      expect(newIndex.createIndex('doc.json', shortFile2)['doc.json'][0]).toEqual(result);
    });

    it('returns an object of key file name and value of array of file indices,' +
     'file name and file titles', () => {
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
        unusual: [1] }, 'doc.json', ['Alice in Wonderland', 'The Lord of the Rings: The Fellowship of the Ring.']];
      expect(newIndex.createIndex('doc.json', shortFile2)['doc.json']).toEqual(result);
    });

    it('should only accept an array of objects', () => {
      const testObj = {
        title: 'Alice in Wonderland',
        text: 'Alice. falls- into@ a+ rabbit hole.',
      };

      expect(() => { newIndex.createIndex('test.json', testObj); })
       .toThrow(new Error('This file\'s structure is ' +
       'invalid. Only array of objects are allowed.'));
    });
  });

  describe('Tests for the lowerDocText method', () => {
    it('should turn the text field of documents to lower case', () => {
      newIndex.lowerDocText(lowerDocFile);
      lowerDocFile.forEach((doc) => {
        expect(doc.text).toEqual(doc.text.toLowerCase());
      });
    });

    it('only takes an array of objects as argument', () => {
      expect(() => { newIndex.lowerDocFile({a: 1}) }).toThrowError(TypeError);
      expect(() => { newIndex.lowerDocFile('Taiwo') }).toThrowError(TypeError);
    });

    it('should return the object passed to it with its text fields lower cased', () => {
      const result = [
        {
          title: 'Alice in Wonderland',
          text: 'alice falls into a rabbit hole and enters a world full of imagination.',
        },
        {
          title: 'The Lord of the Rings: The Fellowship of the Ring.',
          text: 'an unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
        },

        {
          title: 'The Lord of the Rings: The Fellowship of the Ring.',
          text: 'an unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
        },
      ];
      expect(newIndex.lowerDocText(lowerDocFile)).toEqual(result);
    });
  });

  describe('Tests for the Search methods', () => {
    const docJsonMock = {'doc.json': [{ alice: [0],
      alliance: [1],
      an: [1],
      man: [1],
      hole: [0],
      a: [0],
      falls: [0],
      rabbit: [0],
      unusual: [1] }, ['Alice in Wonderland', 'The Lord of the Rings: The Fellowship of the Ring.']]};

    it('should return an object of words that appear in a single indexed file', () => {
      const result = { alice: [0],
        alliance: [1],
        an: [1],
        man: [1],
        hole: [0],
        a: [0],
        falls: [0],
        rabbit: [0],
        unusual: [1] };
      expect(newIndex.searchIndex('doc.json', 'alice,an,hole a man', docJsonMock))
          .toEqual(result);
    });

    it('the buildSearchResult should build and return correct search result', () => {
      const result = { alice: [0],
        alliance: [1],
        an: [1],
        man: [1],
        hole: [0],
        a: [0],
        falls: [0],
        rabbit: [0],
        unusual: [1] };
        expect(newIndex.buildSearchResult('doc.json', 'alice,an,hole a man', docJsonMock))
            .toEqual(result);
    });

    it('returns an object of file names against their search results for a search of all files', () => {
      const allFilesResult = newIndex.searchIndex('All Files', 'alice,an,hole,a - man', allFilesMock);
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
      expect(newIndex.searchIndex('doc.json', 'ALICE,AN,HOLE A MAN', docJsonMock)).toEqual(result);
    });

    it('should return words containing substring in search query', () => {
      const result = { alliance: [1],
        an: [1],
        man: [1] };
      expect(newIndex.searchIndex('doc.json', 'an', docJsonMock)).toEqual(result);
    });
  });
});
