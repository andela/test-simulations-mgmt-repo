/* global angular, InvertedIndex, document, toastr*/
const invApp = angular.module('invIndex', []);

toastr.options.timeOut = 2500;
toastr.options.closeButton = true;
toastr.options.preventDuplicates = true;
toastr.options.closeMethod = 'fadeOut';

invApp.controller('invController', ['$scope', ($scope) => {
  const scope = $scope;
  scope.filesRead = {};
  scope.uploadedFiles = [];
  scope.count = 0;
  scope.filesIndexed = {};

  const invertedIndex = new InvertedIndex();

  scope.readFile = (files) => {
    const document = files.target;
    for (let i = 0; i < document.files.length; i += 1) {
      invertedIndex.readFile(document.files[i]).then((fileContent) => {
        if (scope.validateJson(fileContent)) {
          if (invertedIndex.validateFile(JSON.parse(fileContent))) {
            scope.filesRead[document.files[i].name] = fileContent;
            if (!(scope.uploadedFiles.includes(document.files[i].name))) {
              scope.$apply(scope.uploadedFiles.push(document.files[i].name));
            }
          } else {
            toastr.error('invalide file format');
          }
        } else {
          toastr.error(`${document.files[i].name} is not json`);
        }
      });
    }
  };

  scope.validateJson = (fileContent) => {
    try {
      JSON.parse(fileContent);
      return true;
    } catch (error) {
      return false;
    }
  };

  scope.getIndex = (fileName) => {
    try {
      const titles = [];
      const fileContent = JSON.parse(scope.filesRead[fileName]);
      fileContent.forEach(book => titles.push(book.title));
      const indices = invertedIndex.getIndex(fileContent, fileName);
      const documents = [];
      for (let i = 0; i < titles.length; i += 1) {
        documents.push(i);
      }
      scope.showIndex = true;
      scope.indexed = [
        { indexes: indices,
          documentIndexes: documents,
          indexedFile: scope.selectedFile,
          title: titles,
        },
      ];
      scope.count += 1;
      scope.filesIndexed[fileName] = scope.indexed;
    } catch (error) {
      toastr.info('Please select a file to get indexed');
    }
  };

  scope.searchIndex = () => {
    try {
      if (!scope.fileToSearch) {
        throw new Error('Please select a file to search');
      }
      if (!scope.selectedSearch) {
        throw new Error('Please type in word(s) to search for');
      }
      const response = invertedIndex.searchIndex(scope.selectedSearch, scope.fileToSearch);
      if (response === false) {
        throw new Error('Please type word(s) to search for and not symbols');
      }
      scope.search = response;
      scope.showIndex = false;
    } catch (error) {
      toastr.error(error);
    }
  };

  document.getElementById('upload').addEventListener('change', scope.readFile);
}]);
