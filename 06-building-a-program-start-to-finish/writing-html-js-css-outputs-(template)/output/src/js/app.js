(() => {
  angular.module('invertedIndex', ['angular-typed'])
  .controller('InvertedController', ($scope) => {
    const scope = $scope;

    scope.newIndex = new InvertedIndex();
    scope.uploadedFiles = {};
    scope.indexedFiles = {};
    scope.tableHeads = [];
    scope.searchString = document.getElementById('search').innerHTML;

    scope.displayCreate = false;
    scope.displayIndex = false;

    scope.isEmpty = (object) => {
      const objectIsEmpty = Object.keys(object).length === 0;
      return objectIsEmpty;
    };

    const displayMessage = (message) => {
      scope.message = message;
      $('#response-modal').modal();
      scope.$evalAsync();
    };

    scope.readFile = (inputDom) => {
      const files = [];
      for (let i = 0; i < inputDom.target.files.length; i += 1) {
        files.push(inputDom.target.files[i]);
      }

      files.forEach((file) => {
        const fileName = file.name;

        try {
          InvertedIndex.readFile(file, fileName).then((content) => {
            scope.uploadedFiles[fileName] = angular.fromJson(content);
            scope.displayCreate = true;
            const uploadedFilesList = Object.keys(scope.uploadedFiles);
            scope.fileToIndex = uploadedFilesList[uploadedFilesList.length - 1];

            scope.$evalAsync();
          }).catch((err) => {
            displayMessage(err);
          });
        } catch (err) {
          displayMessage('Invalid file format. Only JSON files are allowed.');
        }
      });
    };

    document.getElementById('file').addEventListener('change', scope.readFile);

    scope.createIndex = () => {
      const fileChoice = scope.fileToIndex;

      try {
        const createdIndex =
        scope.newIndex.createIndex(fileChoice, scope.uploadedFiles[fileChoice]);
        scope.indexedFiles[fileChoice] = createdIndex[fileChoice][0];

        const indexedDocs = angular.fromJson(localStorage.indexedDocs);
        indexedDocs[fileChoice] =
           [scope.indexedFiles[fileChoice], createdIndex[fileChoice][2]];
        localStorage.indexedDocs = angular.toJson(indexedDocs);

        scope.justIndexed = createdIndex[fileChoice][1];
        const indexedFilesList = Object.keys(scope.indexedFiles);

        scope.tableHeads =
         InvertedIndex.getTitles(scope.uploadedFiles[fileChoice]);
        scope.fileToSearch = indexedFilesList[indexedFilesList.length - 1];

        if (indexedFilesList.length > 1) {
          scope.moreThanOneIndexed = true;
        }

        scope.displayIndex = true;
      } catch (err) {
        scope.displayIndex = false;
        displayMessage(err.message);
      }
    };

    scope.recentlyIndexed = () => {
      if (!localStorage.indexedDocs) {
        localStorage.indexedDocs = JSON.stringify({});
      }

      const allRecentlyIndexed =
         Object.keys(JSON.parse(localStorage.indexedDocs));
      scope.moreThanOneStored = allRecentlyIndexed.length > 1;

      return allRecentlyIndexed;
    };

    scope.indexInLocalStorage = () => {
      const filesInStorage =
          Object.keys(angular.fromJson(localStorage.indexedDocs));
      if (filesInStorage.length === 0) {
        return false;
      }

      return true;
    };

    scope.searchIndex = () => {
      scope.fileIndices = angular.fromJson(localStorage.indexedDocs);
      scope.searchResult = {};

      if (scope.fileToSearch === 'All Files') {
        scope.searchResult = InvertedIndex.searchIndex('All Files',
          scope.searchString, scope.fileIndices);
        scope.displayIndex = false;
        scope.allFiles = true;
      } else {
        scope.searchResult[scope.fileToSearch] = InvertedIndex
        .searchIndex(scope.fileToSearch, scope.searchString, scope.fileIndices);
      }

      scope.displayIndex = false;
    };

    scope.getIndex = (fileName) => {
      const fileIndices = angular.fromJson(localStorage.indexedDocs)[fileName];

      scope.indexedFiles[fileName] = fileIndices[0];
      scope.uploadedFiles[fileName] = [scope.indexedFiles[fileName]];
      scope.justIndexed = fileName;

      const indexedFilesList = Object.keys(scope.indexedFiles);
      scope.tableHeads = fileIndices[1];
      scope.fileToSearch = indexedFilesList[indexedFilesList.length - 1];

      if (indexedFilesList.length > 1) {
        scope.moreThanOneIndexed = true;
      }

      scope.displayCreate = false;
      scope.displayIndex = true;

      return fileIndices;
    };

    scope.deleteIndex = (fileName) => {
      if (fileName === 'Delete All') {
        localStorage.indexedDocs = angular.toJson({});
        delete scope.recentlyIndexed();
      } else {
        const fileIndices = angular.fromJson(localStorage.indexedDocs);
        delete fileIndices[fileName];
        localStorage.indexedDocs = angular.toJson(fileIndices);
        scope.recentlyIndexed()
           .splice(scope.recentlyIndexed().indexOf(fileName), 1);
      }
    };
  });
})();
