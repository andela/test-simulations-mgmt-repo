/* eslint-disable */
const books = require('../books.json');
const adventureBooks = require('../adventure-books.json');
const emptyArray = require('../empty.json');
const invalidContent = require('../invalid-content.json');
const invalidFile = require('../invalid-file.json');
const invalidKey = require('../invalid-key.json');
/* eslint-enable */

const index = new InvertedIndex();

describe('Test for valid book data', () => {
    it('Should have keys named \'title\' and \'text\' with string for values', () => {
        expect(index.validateFile(invalidContent)).toBe('Invalid file content');
        expect(index.validateFile(invalidKey)).toBe('Invalid file content');
    });
    it('Should not be an empty file', () => {
        expect(index.validateFile(emptyArray)).toBe('Empty file');
    });
    it('Should not be an invalid file', () => {
        expect(index.validateFile(books)).toBe('Valid file');
    });
    it('Should be an invalid file', () => {
        expect(index.validateFile(invalidFile)).toBe('Invalid file');
    });
});

describe('Tokenize JSON file and return unique words in array', () => {
    const bookToTokenize = [{ title: 'Alice , / ?', text: 'enters a a.' }];

    it('should return " array " for a valid json file input', () => {
        expect(typeof (index.tokenize(`${bookToTokenize[0].title} ${bookToTokenize[0].text}`))).toBe(typeof ([]));
    });
    it('should return "an array of books with filtered contents"', () => {
        expect(index.tokenize(`${bookToTokenize[0].title} ${bookToTokenize[0].text}`)).toEqual(
            ['alice', 'enters', 'a']
        );
    });
});

describe('Create index and get index to display', () => {
    index.createIndex(books, 'books.json');
    index.createIndex(adventureBooks, 'adventure-books.json');
    it('Should return \'undefined\' if index does not exist', () => {
        expect(index.getIndex(' ')).toEqual(undefined);
        expect(index.getIndex('books4')).toEqual(undefined);
    });
    it('Should verify that the index of JSON file can be gotten after file indexed', () => {
        expect(index.getIndex('books.json')).toBeDefined();
    });
    it('Should map the string keys to the correct objects in the JSON array', () => {
        expect(index.getIndex('adventure-books.json')).toEqual(
            {
                king: [0],
                solomons: [0],
                mines: [0],
                it: [0],
                tells: [0],
                of: [0],
                a: [0, 1],
                search: [0],
                an: [0],
                unexplored: [0],
                region: [0],
                africa: [0],
                by: [0],
                group: [0],
                adventurers: [0],
                treasure: [1],
                island: [1],
                wild: [1],
                seaman: [1],
                billy: [1],
                bones: [1],
                comes: [1],
                to: [1],
                stay: [1],
                bringing: [1],
                with: [1],
                him: [1],
                large: [1],
                sea: [1],
                chest: [1]
            }
        );
    });
});

describe('Search index test functionality', () => {
    it(`Should return an array of the indices of the correct objects that contain
    the words in the search query`, () => {
        expect(index.searchIndex('a rabbit alliance with man', 'books.json')).toEqual({
            'books.json': {
                a: [0, 1],
                rabbit: [0],
                alliance: [1],
                with: [],
                man: [1]
            }
        });
        expect(index.searchIndex('a king billy', 'adventure-books.json')).toEqual({
            'adventure-books.json': {
                a: [0, 1],
                king: [0],
                billy: [1]
            }
        });
    });
    it('Should normalize search string before search', () => {
        expect(index.searchIndex('A RABBIT!@#$%^&*()+=-][}{/?><.,|}]`~€‹›', 'books.json')).toEqual({
            'books.json': {
                a: [0, 1],
                rabbit: [0]
            }
        });
    });
    it('Should return an object with empty indices books key if no match is found', () => {
        expect(index.searchIndex('house', 'books.json')).toEqual({
            'books.json': {
                house: []
            }
        });
    });
    it('Should search all indexed files if second argument not passed to searchIndex function', () => {
        expect(index.searchIndex('alice king ring tells about a hobbit')).toEqual({
            'adventure-books.json': {
                alice: [],
                king: [0],
                ring: [],
                tells: [0],
                about: [],
                a: [0, 1],
                hobbit: []
            },
            'books.json': {
                alice: [0],
                king: [],
                ring: [1],
                tells: [],
                about: [],
                a: [0, 1],
                hobbit: [1]
            }
        });
    });
});
