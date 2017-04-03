/**
 * Instance of class created
 * @type Object
 */
const invIndex = new InvertedIndex();
/**
 * Controller handling basic features of app
 * @param  {Object} $scope Binds the view with the controller
 * @return {Object}        [description]
 */
const MainController = ($scope) => {
  $scope.message = '';
  $scope.fileNames = [];
  $scope.fileObjects = {};
  $scope.allIndicies = {};
  $scope.showIndex = true;
  $scope.fileUpload = (event) => {
    const allUploads = event.target;
    for (let count = 0; count < allUploads.files.length; count += 1) {
      const uploadedFile = allUploads.files[count];
      invIndex.readFile(uploadedFile).then((content) => {
        if (JSON.parse(content)) {
          $scope.fileObjects[uploadedFile.name] = JSON
          .parse(content);
          if ((!$scope.fileNames
            .includes(uploadedFile.name))) {
            $scope.$apply($scope.fileNames.push(uploadedFile.name));
          }
        } else {
          $scope.message = `${uploadedFile.name} 
            is not a valid json file.`;
        }
      });
    }
    return $scope.fileObjects;
  };
  document.querySelector('#all-files')
  .addEventListener('change', $scope.fileUpload);

  $scope.createIndex = (selectFile) => {
    const fileContent = $scope.fileObjects[selectFile],
      fileName = selectFile;
    if (invIndex.createIndex(fileName, fileContent)) {
      const indexed = invIndex.getIndex(fileName);
      const uniqueWords = Object.keys(indexed),
        numOfBook = $scope.getNumOfBooks(fileName);

      $scope.allIndicies[fileName] = {
        uniqueWords,
        numOfBook,
        indexed
      };
    }
    return true;
  };
  /**
   * Function to get book count in a file
   * @param  {Object} fileName
   * @return {Array} An array of all files
   */
  $scope.getNumOfBooks = (fileName) => {
    const fileContent = $scope.fileObjects[fileName],
      arr = [];
    for (let i = 0; i < fileContent.length; i += 1) {
      arr.push(i);
    }
    return arr;
  };
  /**
   * Function to search through index created
   * @param  {Object} fileName Object pointing to file
   * @param  {String} query    Search term
   * @return {Object}          Object containing search result
   */
  $scope.searchIndex = (fileName, query) => {
    $scope.showindex = false;
    $scope.searchResult = invIndex.searchIndex();
  };
};
/**
 * Function to handle icon display inside table
 * @return {String} String referencing and icon name.
 */
const rowIcon = () => (input, arr) => {
  if (arr.includes(input)) {
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
.filter('imgCheck', rowIcon);
