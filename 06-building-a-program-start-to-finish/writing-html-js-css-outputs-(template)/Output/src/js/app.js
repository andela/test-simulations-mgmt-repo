const indexApp = angular.module('indexApp', []);
indexApp.controller('indexCtrl', ($scope) => {
  $scope.appName = 'smartIN';
  $scope.myInvertedIndex = new invertedIndex();
  $scope.indexTable = '';
  $scope.indexTableFiles = [];
  $scope.currentFileName = null;
  $scope.liveSearchResult = false;
  $scope.liveSearchKeys = false;
  $scope.indexedFiles = [];
  $scope.searchInFiles = [];
  $scope.updateFilesToSearch = (e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;

    if ($scope.searchInFiles.indexOf(value) === -1) {
      if (isChecked) {
        $scope.searchInFiles.push(value);
      }
    } else {
      const deleteIndex = $scope.searchInFiles.indexOf(value);
      $scope.searchInFiles.splice(deleteIndex, 1);
    }
    // Because we need it realtime
    const searchInputValue = document.getElementById('search').value;
    $scope.liveSearchResult =
      $scope.myInvertedIndex.searchIndex(searchInputValue);
  };
  $scope.getBookDocs = (fileName) => {
    const fileLength = $scope.myInvertedIndex.files[fileName].length;
    return Array.from({ length: fileLength }, (value, key) => key);
  };
  $scope.indexFile = () => {
    $scope.myInvertedIndex.createIndex($scope.currentFileName);
    $scope.indexTable = $scope.myInvertedIndex.indexTable;
    $scope.indexTableFiles.push($scope.currentFileName);
    $scope.indexedFiles.push($scope.currentFileName);
    $scope.currentFileName = '';
  };

  /* Validate JSON, read and store file  */
  $scope.readAndCheckFile = (selectedFile) => {
    const fileReader = new FileReader();
    let fileJsonContent;
    fileReader.onload = () => {
      try {
        fileJsonContent = JSON.parse(fileReader.result);
      } catch (e) {
        Materialize.toast('Please upload a JSON file with content',
      2000, 'red');
        return;
      }
      if (!$scope.myInvertedIndex.readFile(fileJsonContent)) {
        Materialize.toast('Invalid JSON file format', 2000, 'red');
      } else {
        $scope.myInvertedIndex.files[selectedFile.name] = fileJsonContent;
        $scope.$apply(() => {
          $scope.currentFileName = selectedFile.name;
          $scope.indexTableFiles.push($scope.currentFileName);
        });
      }
    };

    fileReader.readAsText(selectedFile);
  };

  /* Handling file upload and extension checking */
  const fileInputField = document.getElementById('fileInput');
  fileInputField.addEventListener('change', (e) => {
    const selectedFile = e.target.files[0];
    const acceptedFileType = 'application/json';
    const selectedFileType = selectedFile.type;
    const isValidFileType = Object.is(selectedFileType, acceptedFileType);
    if (!isValidFileType) {
      Materialize.toast('Invalid File Type', 2000, 'cyan');
      $('#fileInput').val('');
    } else {
      $scope.readAndCheckFile(selectedFile);
    }
  });

  $('#search').on('keyup', () => {
    const searchTerm = $('#search').val();
    if ($scope.searchInFiles.length > 0) {
      $scope.myInvertedIndex.searchIndex(searchTerm, $scope.searchInFiles);
    } else {
      $scope.myInvertedIndex.searchIndex(searchTerm);
    }
    $scope.$apply(() => {
      if ($scope.searchInFiles.length > 0) {
        $scope.liveSearchResult =
          $scope.myInvertedIndex.searchIndex(searchTerm, $scope.searchInFiles);
        $scope.liveSearchKeys = Object.keys($scope.liveSearchResult);
      } else {
        $scope.myInvertedIndex.searchIndex(searchTerm);
        $scope.liveSearchKeys = Object.keys($scope.liveSearchResult);
      }
      $scope.liveSearchKeys = Object.keys($scope.liveSearchResult);
    });
  });
});

$(document).ready(() => {
  $('.modal').modal();
});
