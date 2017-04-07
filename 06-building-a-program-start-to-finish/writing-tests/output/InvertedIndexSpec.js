const InvertedIndex = require('../public/builds/InvertedIndex').InvertedIndex;

const books = require('../booksamples/books.json');
const booksInvalidContent = require('../booksamples/booksInvalidContent.json');
const bookBadJson = require('../booksamples/bookBadJson.json');
const bookEmptyJson = require('../booksamples/bookEmptyJson.json');

const bookText = ' ';

const invertedIndex = new InvertedIndex();

describe('iDex Inverted Index', () => {
  beforeEach((done) => {
    invertedIndex.createIndex('books', books);
    invertedIndex.createIndex('booksInvalidContent', booksInvalidContent);
    invertedIndex.createIndex('bookBadJson', bookBadJson);
    invertedIndex.createIndex('bookText', bookText);
    done();
  });
  describe('The InvertedIndex class', () => {
    it('should be defined', () => {
      expect(InvertedIndex).toBeDefined();
    });

    it('should have a defined instance', () => {
      expect(invertedIndex).toBeDefined();
      expect(invertedIndex instanceof InvertedIndex).toBeTruthy();
    });

    it('should default instance properties to object types', () => {
      expect(invertedIndex.iDexMapper).toBeDefined();
      expect(typeof invertedIndex.iDexMapper).toEqual('object');

      expect(invertedIndex.numberOfDocuments).toBeDefined();
      expect(typeof invertedIndex.numberOfDocuments).toEqual('object');

      expect(invertedIndex.unIndexedBooks).toBeDefined();
      expect(invertedIndex.unIndexedBooks).toEqual({});
      expect(typeof invertedIndex.unIndexedBooks).toEqual('object');

      expect(invertedIndex.indexedBookTitles).toBeDefined();
      expect(typeof invertedIndex.indexedBookTitles).toEqual('object');
    });
  });

  describe('The readFile method', () => {
    it('should return the json file if it is valid', () => {
      expect(InvertedIndex.readFile(JSON.stringify(books))).toEqual((books));
    });

    it('should return the json file for an empty json', () => {
      expect(InvertedIndex.readFile(JSON.stringify(bookEmptyJson)))
        .toEqual((bookEmptyJson));
    });

    it('should return false if the file cannot be parsed', () => {
      expect(InvertedIndex.readFile((bookText))).toBe((false));
      expect(InvertedIndex.readFile((bookText))).toBeFalsy();
    });
  });

  describe('The validateFile method', () => {
    describe('ensures each document is valid', () => {
      let result = '';
      beforeEach((done) => {
        InvertedIndex.validateFile(bookBadJson, 'bookBadJson.json')
        .catch((error) => {
          result = error;
          done();
        });
      });
      it('should have a `title` and `text` properties', () => {
        const expected = "No 'title' or 'text' in Document 1 of bookBadJson";
        expect(result).toBe(expected);
        expect(typeof result).toBe('string');
      });
    });

    describe('title and text properties must have valid contents', () => {
      let result = '';
      beforeEach((done) => {
        InvertedIndex.validateFile(booksInvalidContent, 'booksInvalidContent')
        .catch((error) => {
          result = error;
          done();
        });
      });
      it('both title and text must contain values', () => {
        expect(result).toBe('Document 1 have an empty title or text.');
        expect(typeof result).toBe('string');
      });
    });

    describe('title and text properties must have valid contents', () => {
      let result = '';
      beforeEach((done) => {
        InvertedIndex.validateFile(bookEmptyJson, 'bookEmptyJson.json')
        .catch((error) => {
          result = error;
          done();
        });
      });
      it('both title and text must contain values', () => {
        expect(result).toBe('Cannot index an empty object');
        expect(typeof result).toBe('string');
      });
    });

    describe('title and text properties must have valid contents', () => {
      let result = '';
      beforeEach((done) => {
        InvertedIndex.validateFile(books, 'books.json')
        .then((response) => {
          result = response;
          done();
        });
      });
      it('both title and text must contain values', () => {
        expect(result).toEqual({ books: {
          0: {
            title: result.books['0'].title,
            text: result.books['0'].text,
          },
          1: {
            title: result.books['1'].title,
            text: result.books['1'].text,
          },
        } });
        expect(typeof result).toBe('object');
      });
    });
  });

  describe('The tokenize method', () => {
    it('should remove multiple white spaces, special characters', () => {
      const txt = '  This!@#*$($)%) is a \t really\n random#*! string )#......';
      const expected = 'this is a really random string';
      expect(InvertedIndex.tokenize(txt)).toEqual(expected);
      expect(InvertedIndex.tokenize(txt)).toContain('random');
      expect(typeof InvertedIndex.tokenize(txt).length).toBe('number');
      expect(InvertedIndex.tokenize(txt).length).toBe(expected.length);
    });

    it('should return  only lowercase letters', () => {
      const txt = '  ThIS!@#*$($)%) is a \t REALLY  \n RanDOm#*! stRinG )#...';
      const expected = 'this is a really random string';
      expect(InvertedIndex.tokenize(txt)).toEqual(expected);
    });
  });

  describe('The createsArray method', () => {
    it('should return an array of words from a document "title" & "text"',
      () => {
        const sentence = {
          0: {
            title: 'my cheese',
            text: 'knew their edge.',
          },
          1: {
            title: 'times of sciences',
            text: 'fly with an edge',
          },
        };
        const expected = [['my', 'cheese', 'knew', 'their', 'edge'],
          ['times', 'of', 'sciences', 'fly', 'with', 'an', 'edge']];

        expect(invertedIndex.createsArray('bookname', sentence))
          .toEqual(expected);
        expect(typeof invertedIndex.createsArray('bookname', sentence))
          .toBe('object');
        expect(Array.isArray(invertedIndex.createsArray('bookname', sentence)))
          .toBeTruthy();
      });
  });

  describe('The setBookTitles method', () => {
    it('should set titles for each book created', () => {
      expect(invertedIndex.setBookTitles('mybook', 'my book title'))
        .toEqual(invertedIndex.indexedBookTitles.mybook['my book title']);
    });
  });

  describe('The createIndex method', () => {
    const book = {
      0: {
        title: 'my story',
        text: "who does'nt wish for a lovely story",
      },
      1: {
        title: 'my wishes',
        text: 'story of a lovely unicorn',
      },
    };
    let result = '';
    beforeEach((done) => {
      invertedIndex.createIndex('mybook', book)
        .then((response) => {
          result = response;
          done();
        });
    });
    it('should return an inverted index', () => {
      const expected = {
        my: [0, 1],
        story: [0, 1],
        who: [0],
        doesnt: [0],
        wish: [0],
        for: [0],
        a: [0, 1],
        lovely: [0, 1],
        wishes: [1],
        of: [1],
        unicorn: [1],
      };
      expect(result).toEqual(expected);
    });
  });

  describe('The getIndex method', () => {
    it('should be able to retreive all indexes of a book already indexed',
      () => {
        expect(invertedIndex.getIndex('books')).toEqual({
          how: [0],
          to: [0],
          read: [0],
          a: [0],
          book: [0],
          men: [0],
          are: [0],
          rational: [0],
          animals: [0, 1],
          their: [0],
          rationality: [0],
          agreement: [0],
          is: [0],
          the: [0, 1],
          source: [0],
          of: [0, 1],
          power: [0],
          agree: [0],
          naked: [1],
          ape: [1],
          indeed: [1],
          we: [1],
          have: [1],
          most: [1],
          subtle: [1],
          and: [1],
          complex: [1],
          facial: [1],
          expression: [1],
          system: [1],
          all: [1],
          living: [1] });
      });

    it('should retreive all indexes of a book already indexed', () => {
      expect(invertedIndex.getIndex('books').complex).toEqual([1]);
      expect(invertedIndex.getIndex('books').rationality).toEqual([0]);
      expect(invertedIndex.getIndex('books').facial).toEqual([1]);
    });

    it('should return an undefined for unavailable words', () => {
      expect(invertedIndex.getIndex('books').africa).toBeUndefined();
      expect(invertedIndex.getIndex('books').andela).toBeUndefined();
      expect(invertedIndex.getIndex('books').tdd).toBeUndefined();
    });
  });

  describe('The searchIndex method', () => {
    it('should return an empty result if no token was searched for', () => {
      expect(invertedIndex.searchIndex('books', '')).toEqual([{
        books: {
          '': [],
        },
      }]);
    });

    it('should return appropriate result', () => {
      expect(invertedIndex.searchIndex('books', 'complex read animals'))
        .toEqual([{
          books: {
            complex: [1],
            read: [0],
            animals: [0, 1],
          },
        }]);
    });

    it('should get appropriate result when searching in multiple files', () => {
      expect(invertedIndex.searchIndex('allBooks', 'haw animals')).toEqual([
        {
          books: {
            haw: [],
            animals: [0, 1],
          },
        },
        {
          booksInvalidContent: {
            haw: [],
            animals: [1],
          },
        },
        {
          bookBadJson: {
            haw: [0],
            animals: [],
          },
        },
        {
          bookText: {
            haw: [],
            animals: [],
          },
        },
        {
          mybook: {
            haw: [],
            animals: [],
          },
        }]);
    });

    it('should return false if book name has not been indexed', () => {
      expect(invertedIndex.searchIndex('unknownBook', 'cheese doughnut'))
        .toEqual([false]);
      const searchResult = invertedIndex
        .searchIndex('unknownBook', 'cheese doughnut');
      const iterator = searchResult[Symbol.iterator]();
      expect(iterator.next().value).toBeFalsy();
    });
  });

  describe('The getSearchResult method', () => {
    it('should return appropriate result', () => {
      expect(invertedIndex
        .getSearchResult('books', ['complex', 'read', 'animals']))
          .toEqual({
            books: {
              complex: [1],
              read: [0],
              animals: [0, 1],
            },
          });
    });
    it('should return false if book name has not been indexed', () => {
      expect(invertedIndex
        .getSearchResult('unknownBook', ['cheese', 'doughnut']))
        .toEqual(false);
    });
  });
});
