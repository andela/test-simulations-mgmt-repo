const helpers = require('../js/helpers');
const InvertedIndex = require('../js/inverted-index');
const model = require('./testmodels');

const InvertedIndexTest = new InvertedIndex();

describe('sort function', () => {
  it('should sort unordered objects alphabetically',
   () => {
     const sortedObject = helpers.sort(model.unorderedObject);
     expect(Object.keys(sortedObject))
    .toEqual(Object.keys(model.orderedObject));
   });
});

describe('fetchTitle function', () => {
  it('should compile all value of title key in an array of objects',
  () => {
    expect(helpers.fetchTitle(model.validJsonTestData[0]))
    .toEqual(['A good bot', 'A bad bot']);
  });
});

describe('allIsEmpty function', () => {
  it('should return true if every key in object is null',
  () => {
    expect(helpers.allIsEmpty(model.searchResults[5])).toEqual(true);
  });
});

describe('isFound function', () => {
  it('should return true if string is found in array',
  () => {
    expect(helpers.isFound('A good bot', ['A good bot', 'A bad bot']))
    .toEqual(true);
  });

  it('should return false if string is not found in array',
  () => {
    expect(helpers.isFound('A red bot', ['A good bot', 'A bad bot']))
    .toEqual(false);
  });
});

describe('stripStr function', () => {
  it('should return lowercase string without any symbols',
  () => {
    expect(helpers
    .stripStr('"#NothIng liKe breaKing lIke glAss!", wrote the blonde girl'))
    .toEqual('nothing like breaking like glass wrote the blonde girl');
  });
  it('should return null when searching for symbols in striped string',
  () => {
    expect(helpers
    .stripStr('"#NothIng liKe breaKing lIke glAss!", wrote the blonde girl')
    .match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/))
    .toEqual(null);
  });
  it('should return null when input is not of type String',
  () => {
    expect(helpers.stripStr(32239923023)).toEqual(null);
  });
});

describe('isValid function',
() => {
  it('should return true if input is in a valid format',
  () => {
    expect(helpers.isValid(model.validJsonTestData[0])).toBe(true);
  });

  it('should return false if input is in an invalid format',
  () => {
    expect(helpers.isValid(model.invalidData[1])).toBe(false);
  });

  it('shoul return false if null is passed in',
  () => {
    expect(helpers.isValid(null)).toBe(false);
  });

  it('should return false if nothing is passed in',
  () => {
    expect(helpers.isValid()).toBe(false);
  });

  it('should return false if input is not an Array of objects',
  () => {
    expect(helpers.isValid('A json file')).toBe(false);
    expect(helpers.isValid([])).toBe(false);
    expect(helpers.isValid(32323)).toBe(false);
  });

  it('should return false if the text key is empty',
  () => {
    expect(helpers.isValid([{ title: 'Great', text: '' }]))
    .toBe(false);
  });
  it('should return false if the title key is empty',
  () => {
    expect(helpers
    .isValid([
      { title: '', author: 'Scott Fizgerald', text: 'Gatsby and Daisy' }]))
      .toBe(false);
  });
});


describe('generateIndex function',
() => {
  it('should return generated inverted index for an input',
  () => {
    expect(InvertedIndexTest
    .generateIndex('book1', model.validJsonTestData[0]))
    .toEqual(model.index);
  });

  it('should return null for an empty input',
  () => {
    expect(InvertedIndexTest.generateIndex()).toEqual(null);
  });

  it('should return null if null is passed in',
  () => {
    expect(InvertedIndexTest.generateIndex(null)).toEqual(null);
  });

  it('should return null fif input is not of type Array',
  () => {
    expect(InvertedIndexTest.generateIndex({})).toEqual(null);
    expect(InvertedIndexTest.generateIndex(2323)).toEqual(null);
    expect(InvertedIndexTest.generateIndex('edge cases'))
    .toEqual(null);
  });

  it('should return null if data is not in a valid format',
  () => {
    expect(InvertedIndexTest
    .generateIndex('invalid data', model.invalidData[0]))
    .toEqual(null);
    expect(InvertedIndexTest
    .generateIndex('invalid data', model.invalidData[1]))
    .toEqual(null);
  });
});

describe('Indices property', () => {
  it('should return object of all generated Index',
  () => {
    expect(InvertedIndexTest.indices).toEqual(model.indices);
  });
});


describe('Search function',
() => {
  it('should return search results for query string in file name',
  () => {
    expect(InvertedIndexTest.search('bad good bot knock', 'book1'))
    .toEqual(model.searchResults[0]);
  });

  it('should return null if search query is not found in file',
  () => {
    expect(InvertedIndexTest
    .search('a really good knock for the bot', 'book1'))
    .toEqual(model.searchResults[1]);
  });
});

describe('searchAll function',
() => {
  it('should return search results for query string in all generated files',
  () => {
    InvertedIndexTest
    .generateIndex('book2', model.validJsonTestData[1]);
    expect(InvertedIndexTest
    .searchAll('tomorrow helps the devil give a bot a knock'))
    .toEqual(model.searchResults[4]);
  });

  it('should return filename to null if search query is not found in file',
  () => {
    expect(InvertedIndexTest
    .searchAll('He sticks to his wild side'))
    .toEqual(model.searchResults[3]);
  });
});
