/* global angular, InvertedIndex, document, toastr*/
const invApp = angular.module('invIndex', []);

toastr.options.closeDuration = 500;
toastr.options.closeButton = true;
toastr.options.preventDuplicates = true;
toastr.options.closeMethod = 'fadeOut';

invApp.controller('invController', ['$scope', ($scope) => {
  const scope = $scope;
  scope.filesRead = {};
  scope.uploadedFiles = [];
  scope.count = 0;
  scope.filesIndexed = {};

  const invIndex = new InvertedIndex();

  scope.readFile = (files) => {
    const doc = files.target;
    for (let i = 0; i < doc.files.length; i += 1) {
      invIndex.readFile(doc.files[i]).then((fileContent) => {
        if (scope.validateJson(fileContent)) {
          if (invIndex.validateFile(JSON.parse(fileContent))) {
            scope.filesRead[doc.files[i].name] = fileContent;
            if (!(scope.uploadedFiles.includes(doc.files[i].name))) {
              scope.$apply(scope.uploadedFiles.push(doc.files[i].name));
            }
          } else {
            toastr.error('invalide file format');
          }
        } else {
          toastr.error(`${doc.files[i].name} is not json`);
        }
      });
    }
  };

  scope.validateJson = (filename) => {
    try {
      JSON.parse(filename);
      return true;
    } catch (e) {
      return false;
    }
  };

  scope.getIndex = (filename) => {
    try {
      const titles = [];
      const file = JSON.parse(scope.filesRead[filename]);
      file.forEach(obj => titles.push(obj.title));
      const indices = invIndex.getIndex(file, filename);
      const documents = [];
      for (let i = 0; i < titles.length; i += 1) {
        documents.push(i);
      }
      scope.showIndex = true;
      scope.indexed = [
        { indexes: indices,
          docs: documents,
          indexedFile: scope.selectedFile,
          title: titles,
        },
      ];
      scope.count += 1;
      scope.filesIndexed[filename] = scope.indexed;
    } catch (e) {
      toastr.info('Please select a file to get indexed');
    }
  };

  const searchIndexOneFile = () => {
    try {
      if (!scope.fileSearch) {
        throw new Error('Please select a file to search');
      }
      if (!scope.selectedSearch) {
        throw new Error('Please type in word(s) to search for');
      }
      const cleanedTerms = invIndex.tokenize(scope.selectedSearch);
      if (cleanedTerms[0] === '' && cleanedTerms.length === 1) {
        throw new Error('Please type word(s) to search for and not symbols');
      } else {
        const result = {};
        scope.displaySearch = cleanedTerms.toString();
        cleanedTerms.forEach((term) => {
          const found = invIndex.searchIndex(term, scope.fileSearch);
          result[term] = found;
        });

        const titles = [];
        const file = JSON.parse(scope.filesRead[scope.fileSearch]);
        file.forEach(obj => titles.push(obj.title));
        const documents = [];
        for (let i = 0; i < titles.length; i += 1) {
          documents.push(i);
        }
        scope.search.push({
          indexes: result,
          docs: documents,
          searchedFile: scope.fileSearch,
          title: titles,
        });
        scope.showIndex = false;
      }
    } catch (e) {
      toastr.error(e);
    }
  };

  scope.searchIndex = () => {
    scope.search = [];
    if (scope.fileToSearch === 'All') {
      const all = Object.keys(scope.filesIndexed);
      all.forEach((file) => {
        scope.fileSearch = file;
        searchIndexOneFile();
      });
    } else {
      scope.fileSearch = scope.fileToSearch;
      searchIndexOneFile();
    }
  };

  document.getElementById('upload').addEventListener('change', scope.readFile);
}]);
