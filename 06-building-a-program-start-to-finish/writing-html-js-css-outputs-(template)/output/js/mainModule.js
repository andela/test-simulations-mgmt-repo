/**
 * Instance of class created
 * @type Object
 */
const invertedIndex = new InvertedIndex();
/**
 * Controller handling basic features of app
 * @param  {Object} $scope Binds the view with the controller
 * @return {Object}        Main app controller
 */
const MainController = ($scope) => {
  $scope.message = 'Welcome. Please upload a valid .json file.';
  $scope.word = 'info';
  $scope.fileNames = [];
  $scope.fileObjects = {};
  $scope.indexedFiles = [];
  $scope.showIndex = true;
  /**
   * Function to handle file upload
   * @param  {Object} event DOM object containing all uploads
   * @return {Object}       Object containing all file object
   */
  $scope.fileUpload = (event) => {
    const allUploads = event.target;
    for (let count = 0; count < allUploads.files.length; count += 1) {
      const uploadedFile = allUploads.files[count],
        singleFileName = uploadedFile.name;
      InvertedIndex.readFile(uploadedFile).then((content) => {
        if (!InvertedIndex.validateFile(singleFileName, JSON.parse(content))) {
          $scope.$apply(() => {
            $scope.message = `${singleFileName} is not a valid .json file.`;
            $scope.word = 'danger';
            return $scope.message;
          });
        } else {
          $scope.message = 'Upload successfull';
          $scope.word = 'success';
          $scope.fileObjects[singleFileName] = JSON
            .parse(content);
          if ((!$scope.fileNames
              .includes(uploadedFile.name))) {
            $scope.$apply(() => $scope.fileNames.push(uploadedFile.name));
          }
        }
      });
    }
    return $scope.fileObjects;
  };
  document.querySelector('#all-files')
  .addEventListener('change', $scope.fileUpload);
  /**
   * Functions to create index
   * @param  {Object} selectFile Input object
   * @return {Boolean}           True or false
   */
  $scope.createIndex = (selectFile) => {
    $scope.showIndex = true;
    const fileContent = $scope.fileObjects[selectFile],
      fileName = selectFile;
    $scope.indices = {};
    if (invertedIndex.createIndex(fileName, fileContent)) {
      const indexed = invertedIndex.getIndex(fileName),
        uniqueWords = Object.keys(indexed),
        totalBooks = $scope.getTotalBooks(fileName);
      $scope.indices[fileName] = {
        uniqueWords,
        totalBooks,
        indexed
      };

      $scope.indexedFiles.push(fileName);
    }
    if ($scope.indices[fileName]) {
      $scope.message = `Index created for ${fileName}`;
      $scope.word = 'success';
      return true;
    }

    $scope.message = 'No index created';
    $scope.word = 'info';
  };
  /**
   * Function to get book count in a file
   * @param  {Object} fileName
   * @return {Array} An array of all files
   */
  $scope.getTotalBooks = (fileName) => {
    const fileContent = $scope.fileObjects[fileName],
      array = [];
    for (let i = 0; i < fileContent.length; i += 1) {
      array.push(i);
    }
    return array;
  };
  /**
   * Function to search through index created
   * @param  {Object} fileName Object pointing to file
   * @param  {String} query    Search term
   * @return {Object}          Object containing search result
   */
  $scope.searchIndex = (fileName, query) => {
    if (typeof query === 'undefined' || query.length === 0
      || !$scope.createIndex) {
      $scope.message = `Please create an index first
       and input a search token/word.`;
      $scope.word = 'warning';
    }
    const fileArray = [];
    const queriedWords = invertedIndex.tokenize(query).toString();
    fileArray.push(fileName);
    if ($scope.createIndex) {
      $scope.showIndex = false;
      $scope.searchedIndices = {};
      const searched = invertedIndex.searchIndex(fileArray, query),
        books = Object.keys(searched);
      books.forEach((bookName) => {
        const totalBooks = $scope.getTotalBooks(bookName);
        const result = searched[bookName];
        $scope.searchedIndices[bookName] = {
          totalBooks,
          result
        };
      });
    }
    $scope.message = 'Kindly create an index before searching';
    $scope.word = 'warning';
    if ($scope.searchedIndices) {
      $scope.message = `Search Index created for word(s) '${queriedWords}'`;
      $scope.word = 'success';
      return true;
    }
  };
};
/**
 * Function to handle icon display inside table
 * @return {String} String referencing and icon name.
 */
const tableIcon = () => (input, array) => {
  if (array.includes(input)) {
    return 'check';
  }
  return 'dash';
};
MainController.$inject = ['$scope'];
/**
 * Module declaration
 */
angular.module('mainApp', [])
.controller('MainController', MainController)
.filter('iconCheck', tableIcon);
