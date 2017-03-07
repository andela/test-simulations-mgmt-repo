const helpers = require('../js/helpers');
const InvertedIndex = require('../js/inverted-index');
const model = require('./testmodels');

const InvertedIndexTest = new InvertedIndex();

describe('Test suite for helper functions', () => {
  it('Given an unordered object, function should return an alphabetically ordered version of the object',
   () => {
     const sortedObject = helpers.sort(model.unorderedObject);
     expect(Object.keys(sortedObject))
    .toEqual(Object.keys(model.orderedObject));
   });

  it('Given a json object, where each object contains a title key, function should compile all title values into an array and return it',
  () => {
    expect(helpers.fetchTitle(model.validJsonTestData[0]))
    .toEqual(['A good bot', 'A bad bot']);
  });

  it('Given that every key in an object has the value of null, function return true',
  () => {
    expect(helpers.allIsEmpty(model.searchResults[5])).toEqual(true);
  });

  it('Given a string, function should check a given array if the string matches the string in an index, if found function return true',
  () => {
    expect(helpers.isFound('A good bot', ['A good bot', 'A bad bot'])).toEqual(true);
  });

  it('Given a string, function should check a given array if the string matches the string in an index, if found function return false',
  () => {
    expect(helpers.isFound('A red bot', ['A good bot', 'A bad bot'])).toEqual(false);
  });

  it('Given a string, function should remove all special symbols, convert the string to lowercase and return the new value',
  () => {
    expect(helpers
    .stripStr('"#NothIng liKe breaKing lIke glAss!", wrote the blonde girl'))
    .toEqual('nothing like breaking like glass wrote the blonde girl');
    expect(helpers
    .stripStr('"#NothIng liKe breaKing lIke glAss!", wrote the blonde girl')
    .match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/))
    .toEqual(null);
  });
});

describe('Given that a parameter is passed into this method, it should check if the parameter is in a valid format',
() => {
  it('Given a valid json object, function should return true',
  () => {
    expect(helpers.isValid(model.validJsonTestData[0])).toBe(true);
  });

  it('Given an invalid json object, function should return false',
  () => {
    expect(helpers.isValid(model.invalidData[1])).toBe(false);
  });

  it('Given that null is passed in as an argument, function should return false',
  () => {
    expect(helpers.isValid(null)).toBe(false);
  });

  it('Given that nothing is passed in as an argument, function should return false',
  () => {
    expect(helpers.isValid()).toBe(false);
  });

  it('Given that a non object data type is passed as an argument, function should return false',
  () => {
    expect(helpers.isValid('A json file')).toBe(false);
    expect(helpers.isValid([])).toBe(false);
    expect(helpers.isValid(32323)).toBe(false);
  });

  it('Given that there is neither a text key or title key in the json object, function should return false',
  () => {
    expect(helpers.isValid([{ title: 'Great', text: '' }]))
    .toBe(false);
    expect(helpers
    .isValid([
      { title: '', author: 'Scott Fizgerald', text: 'Gatsby and Daisy' }]))
      .toBe(false);
  });
});


describe('Given a file name and a valid json object, method should return a generated index',
() => {
  it('Given a file name and a valid json object, method should return a generated index',
  () => {
    expect(InvertedIndexTest
    .generateIndex('book1', model.validJsonTestData[0]))
    .toEqual(model.index);
  });

  it('Given that an index was generated, the index should be stores in the indices property of the class',
  () => {
    expect(InvertedIndexTest.indices).toEqual(model.indices);
  });

  it('Given that an empty parameter or a null value is passed in, method should return null',
  () => {
    expect(InvertedIndexTest.generateIndex()).toEqual(null);
    expect(InvertedIndexTest.generateIndex(null)).toEqual(null);
  });

  it('Given that the parameter passed in is not an object, method should return null',
  () => {
    expect(InvertedIndexTest.generateIndex({})).toEqual(null);
    expect(InvertedIndexTest.generateIndex(2323)).toEqual(null);
    expect(InvertedIndexTest.generateIndex('edge cases'))
    .toEqual(null);
  });

  it('Given that the object passed in is in an invalid format, method should return null',
  () => {
    expect(InvertedIndexTest.generateIndex('invalid data', model.invalidData[0]))
    .toEqual(null);
    expect(InvertedIndexTest.generateIndex('invalid data', model.invalidData[1]))
    .toEqual(null);
  });
});


describe('Given that a searh query is passed in as well as a file name, method should search for the query in the file name stored in the indices property',
() => {
  it('Given a search query and a file name is passed into the method, method should return the words found in tht file',
  () => {
    expect(InvertedIndexTest.search('bad good bot knock', 'book1'))
    .toEqual(model.searchResults[0]);
  });

  it('Given the search query is not found in the indices, method should return null',
  () => {
    expect(InvertedIndexTest
    .search('a really good knock for the bot', 'book1'))
    .toEqual(model.searchResults[1]);
  });

  it('Given the query is not found in the indices property, method should return null', () => {
    expect(InvertedIndexTest
    .search('He sticks to his wild side', 'book1'))
    .toEqual(null);
  });
});

describe('Given a search query, method should search the query in all files in the indices',
() => {
  it('Given a search query menthod, should return an object mapping each word found to file name in indices',
  () => {
    InvertedIndexTest
    .generateIndex('book2', model.validJsonTestData[1]);
    expect(InvertedIndexTest
    .searchAll('tomorrow helps the devil give a bot a knock'))
    .toEqual(model.searchResults[4]);
  });

  it('Given a search query is not found in the indices, method should return null',
  () => {
    expect(InvertedIndexTest
    .searchAll('He sticks to his wild side'))
    .toEqual(model.searchResults[3]);
  });
});
