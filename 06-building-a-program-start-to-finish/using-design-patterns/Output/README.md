### Output 
#### Design Patterns
* A design pattern is a general repeatable solution to a commonly occurring problem in software design.
* Design patterns can speed up the development process by providing tested, proven development paradigms.
* Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability.

#### Design Patterns Used
### Module Design Pattern

``` 
/**
 * Inverted Index class
 */
class InvertedIndex {
/**
 * class constructor
 */
  constructor() {
    this.indices = {};
    this.documentCount = 0;
  }
/**
 * normalizeText takes a string with numbers,
 * spaces and symbols and returns a normalized string
 * @param{String} text - The name of the string to be normalized
 * @return{Array} Array of normalized text
 */
  static normalizeText(text) {
    return (text.toLowerCase().match(/[A-Za-z]+/g).sort());
  }
/**
 * @param{String} words - String to be filtered
 * @return{Array} token - Array without duplicate words
 */
  static uniqueWords(words) {
    const tokens = InvertedIndex.normalizeText(words);
    return tokens.filter((item, index) =>
                tokens.indexOf(item) === index);
  }
  /**
   * isValidFile checks the validity of uploaded files
   * @param {Object} file the selected file
   * @returns {Boolean} check - returns true for valid files
   * and false for invalid files.
   */
  isValidFile(file) {
    this.file = file;
    let check = true;
    try {
      const jsonFile = JSON.parse(JSON.stringify(this.file));
      if (jsonFile.length === 0) {
        check = false;
      }
      jsonFile.forEach((key) => {
        if (typeof key.title !== 'string' || typeof key.text !== 'string') {
          check = false;
        }
      });
    } catch (error) {
      check = false;
    }
    return check;
  }
/**
 * createIndex takes a document and builds an index out of it
 * @param{String} fileName - The name of the file to be indexed
 * @param{Array} fileContent - The content of the file to be indexed
 * @return{Array} indices - Maps words to their location
 */
  createIndex(fileName, fileContent) {
    const indexedFile = {};
    const wordsToIndex = [];
    if (this.isValidFile(fileContent)) {
      fileContent.forEach((document) => {
        this.documentCount += 1;
        if (document.text) {
          wordsToIndex.push(`${document.title} ${document.text}`.toLowerCase());
        }
      });
    }
    const uniqueContent = InvertedIndex.uniqueWords(wordsToIndex.join(' '));
    uniqueContent.forEach((word) => {
      indexedFile[word] = [];
      wordsToIndex.forEach((document, index) => {
        if (document.includes(word)) {
          indexedFile[word].push(index);
        }
      });
    });
    this.indices[fileName] = indexedFile;
  }
/**
 * @param{String} fileName - The name of the file
 * whose index is required
 * @return{Object} indices - The correct mapping of words to
 * locations for specified file
 */
  getIndex(fileName) {
    return this.indices[fileName];
  }
/**
 * @param{String} query - Words to search for
 * @param{String} indexToSearch - Index to query
 * @return{Object} searchResult - Maps searched words
 * to document locations
 */
  searchIndex(query, indexToSearch) {
    const searchResult = {};
    const searchTerms = InvertedIndex.uniqueWords(query);
    searchTerms.forEach((word) => {
      const errorMessage =
      ` We are Sorry but ${word} is not found in our database`;
      if (indexToSearch) {
        searchResult[word] = this.indices[indexToSearch][word] ?
          this.indices[indexToSearch][word] : errorMessage;
      } else {
        return 'Choose a filename';
      }
    });
    return searchResult;
  }
  /**
   * @param{String} query - Words to search for
   * @return{Object} searchResult - Maps searched words
   */
  searchAll(query) {
    const searchResult = {};
    Object.keys(this.indices).forEach((fileName) => {
      searchResult[fileName] = this.searchIndex(query, fileName);
    });
    return searchResult;
  }
}
```
Javascript classes are module design patterns. They provide loose coupling which allows for well structured code.

### Observer Design Pattern
``` 
$scope.createIndex = () => {
      const fileName = document.getElementById('createIndexSelect').value;
      const indexToCreate = uploadedFileNames.indexOf(fileName);
      if ($scope.uploadSuccess) {
        newIndex.createIndex(fileName, uploadedFileContent[indexToCreate]);
        $scope.range = [];
        const filedLength = $scope.filed.length;
        for (let docIndex = 0; docIndex < filedLength; docIndex += 1) {
          $scope.range.push(docIndex);
        }
        $scope.indexExists = true;
        $scope.indexObject = newIndex.getIndex(fileName);
      } else {
        $scope.indexExists = false;
        SweetAlert.swal('Error', 'Upload a valid JSON file first.', 'error');
      }
    };
```
Scope is part of the MVC or MVVM architecture. Once the model is change, the view is updated.
### Author
 **Delores Diei**