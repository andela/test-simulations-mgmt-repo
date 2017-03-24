(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const app = angular.module('invertedIndex', []);

// configure angular toastr for notifications
toastr.options.closeButton = true;
toastr.options.closeMethod = 'fadeOut';
toastr.options.closeDuration = 1000;
toastr.options.preventDuplicates = true;

app.controller('mainController', ['$scope', ($scope) => {
  $scope.fileNames = [];
  $scope.fileObject = {};
  $scope.fileContent = {};
  $scope.titles = {};
  $scope.current = {};
  $scope.indices = {};
  $scope.indexedFiles = {};
  $scope.allIndices = {};
  $scope.result = {};
  $scope.show = false;

  // DOM manipulation
  const fileUpload = document.getElementById('file-input');
  const indexBtn = document.getElementById('getIndex');

  // creating instance variables
  const invertedIndex = new InvertedIndex();

  // event listeners
  indexBtn.addEventListener('click', () => {
    const fileName = document.getElementById('selectedFile').value;
    $scope.getIndex(fileName.trim());
  });

  fileUpload.addEventListener('change', () => {
    $scope.uploadFile(fileUpload.files);
  });

  // file validation
  const validateJSON = (file) => {
    let val = true;
    file.forEach((uploadedFile) => {
      if (!uploadedFile.hasOwnProperty('text') ||
        !uploadedFile.hasOwnProperty('text')) {
        val = false;
        return false;
      }
    });
    return val;
  };

  $scope.uploadFile = (file) => {
    for (let i = 0; i < file.length; i += 1) {
      if (file[i].name.split('.').pop() !== 'json') {
        return toastr.error('file must be a JSON');
      }
      if ($scope.fileNames.indexOf(file[i].name) !== -1) {
        return toastr.info(`${file[i].name} already uploaded!`);
      }
      invertedIndex.readFile(file[i])
      .then((uploadedFile) => {
        if (!validateJSON(uploadedFile)) {
          toastr.error('invalid file structure');
          return false;
        }
        $scope.fileContent[file[i].name] = uploadedFile;
        const tempTitles = [];
        Object.keys(uploadedFile).forEach((key) => {
          tempTitles.push(uploadedFile[key].title);
        });
        $scope.titles[file[i].name] = tempTitles;

        $scope.$apply($scope.fileNames.push(file[i].name));
        return toastr.success(`${file[i].name} upload successful`);
      })
      .catch(error => toastr.error(error));
    }
  };

  $scope.getIndex = (fileName) => {
    // check if nothing is selected
    $scope.currentTitle = $scope.titles;
    $scope.currentIndices = [];
    $scope.currentIndices[0] = {};
    if (fileName === '-- select a file to index --') {
      return toastr.info('you have to select a file');
    }
    invertedIndex.createIndex(fileName, $scope.fileContent[fileName]);
    $scope.indices[fileName] = invertedIndex.getIndices(fileName);
    $scope.currentIndices[0].terms = $scope.indices[fileName];
    $scope.currentIndices[0].fileName = fileName;
    $scope.show = true;
    return toastr.success(`${selectedFile.value} index created`);
  };

  $scope.searchIndices = () => {
    $scope.currentIndices = {};
    const searchQuery = document.getElementById('search-query').value;
    const filter = document.getElementById('selectedBook').value.trim();
    $scope.currentIndices = $scope.indices[filter];

    if (searchQuery === '' || searchQuery === undefined
      || searchQuery === null) {
      $scope.currentIndices = $scope.indices[filter];
      toastr.success('please type in a search query');
    }
    if (filter === 'all') {
      $scope.currentTitle = $scope.titles;
    } else {
      $scope.currentTitle[filter] = $scope.titles[filter];
    }

    $scope.documentCount = [];
    let count = 0;
    if (filter === 'all') {
      count = Object.keys($scope.fileContent).length - 1;
      let i = 0;
      while (i <= count) {
        $scope.documentCount.push(i);
        i += 1;
      }
    } else {
      count = Object.keys($scope.fileContent[filter]).length - 1;
      let i = 0;
      while (i <= count) {
        $scope.documentCount.push(i);
        i += 1;
      }
    }
    $scope.currentIndices = invertedIndex.searchIndices(filter, searchQuery);
    console.log($scope.currentIndices);
  };

  $scope.range = (length) => {
    const range = [];
    for (let i = 0; i <= length; i += 1) {
      range.push(i);
    }
    return range;
  };
}]);

},{}]},{},[1]);
