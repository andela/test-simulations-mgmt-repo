/* eslint-disable no-loop-func*/
const app = angular.module('inverted_index', []);
app.controller('myController', ['$scope', ($scope) => {
  const invertedIndex = new InvertedIndex();
  $scope.documents = [];
  $scope.fileNames = [];
  $scope.numberOfDocuments = {};
  $scope.indices = {};
  $scope.showUploaded = false;
  $scope.showTable = false;
  $scope.showSearch = false;
  $scope.file = {};
  $scope.indexAtr = {};
  $scope.filesToSearch = [];
  $scope.fileContent = {};
  $scope.search = {};
  const fileUpload = document.getElementById('files');
  fileUpload.addEventListener('change', () => {
    $scope.uploadFile(fileUpload);
  });
  $scope.uploadFile = (file) => {
    file = file.files;
    for (let i = 0; i < file.length; i += 1) {
      const fileExtension = file[i].name.split('.').pop();
      if (fileExtension !== 'json') {
        return toastr.error('This is not a json file');
      }
      if ($scope.fileNames.includes(file[i].name)) {
        return toastr.error(`${file[i].name} has been uploaded`, 'Error');
      }
      $scope.documents = $scope.fileNames.push(file[i].name);
      $scope.$apply();
      InvertedIndex.readFile(file[i], (e) => {
        const data = JSON.parse(e.target.result);
        const fileCheck = InvertedIndex.validateFile(data);
        if (fileCheck.status) {
          $scope.fileContent[file[i].name] = data;
          $scope.$apply();
          toastr.success(`${file[i].name} uploaded successfully`, 'Success');
        } else {
          return toastr.error(fileCheck.msg);
        }
      });
    }
  };
  $scope.createIndex = () => {
    const fileName = document.getElementById('selectFile').value;
    const fileContent = $scope.fileContent[fileName];
    if (fileName.length === 0) {
      return toastr.error('Upload a file before you create index', 'Error');
    }
    try {
      // fileContent = JSON.parse(fileContent);
      invertedIndex.createIndex(fileName, fileContent);
    } catch (err) {
      toastr.error(err.message);
    }
    const index = invertedIndex.getIndex(fileName);
    $scope.indices[fileName] = index;
    $scope.fileContent[fileName] = fileContent;
    const length = fileContent.length;
    const temp = [];
    for (let i = 0; i < length; i += 1) {
      temp.push(i);
    }
    $scope.numberOfDocuments[fileName] = temp;
    $scope.showTable = true;
    return $scope.filesToSearch.push(fileName);
  };

  $scope.searchIndex = () => {
    const filename = document.getElementById('selectSearchFile').value;
    const words = $scope.searchString;
    if (filename !== 'Select file') {
      $scope.searchFileName = filename;
      $scope.searchResult = invertedIndex.searchIndex(words, filename);
      $('#modalSearch').modal('show');
      $('#modalSearchFile').modal('hide');
    } else {
      $scope.searchResultAllFiles = invertedIndex.searchIndex(words, filename);
      $('#modalSearch').modal('hide');
      $('#modalSearchFile').modal('show');
    }
  };
  $scope.clearSearch = () => {
    $scope.searchString = '';
    $('#modalSearch').modal('hide');
    $('#modalSearchFile').modal('hide');
  };
}]);
