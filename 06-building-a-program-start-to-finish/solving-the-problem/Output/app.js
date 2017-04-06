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
  $scope.searchResults = {};
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
      invertedIndex.createIndex(fileName, fileContent);
    } catch (err) {
      toastr.error(err.message);
    }
    const index = invertedIndex.getIndex(fileName);
    $scope.indices[fileName] = index;
    $scope.fileContent[fileName] = fileContent;
    const length = fileContent.length;
    const temp = [];
    let i = 0;
    fileContent.forEach(() => {
      temp.push(i);
      i += 1;
    });
    $scope.numberOfDocuments[fileName] = temp;
    $scope.showTable = true;
    return $scope.filesToSearch.push(fileName);
  };

  $scope.searchIndex = () => {
    $scope.searchResults = {};
    const filename = document.getElementById('selectSearchFile').value;
    if (filename === 'Select file') {
      toastr.error('select a file to search', 'Error');
      return;
    }

    const words = $scope.searchString;
    if (filename === 'All files') {
      $scope.searchResults = invertedIndex.searchIndex(words, filename);
    } else {
      $scope.searchResults[filename] =
        invertedIndex.searchIndex(words, filename);
    }
    $('#modalSearchFile').modal('show');
  };

  $scope.clearSearch = () => {
    $scope.searchString = '';
  };
}]);
