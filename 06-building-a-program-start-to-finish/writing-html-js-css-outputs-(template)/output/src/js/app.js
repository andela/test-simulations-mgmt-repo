(() => {
  angular.module('invertedIndex', ['angular-typed']).controller('InvertedController', ($scope) => {
    const scope = $scope;

    scope.newIndex = new InvertedIndex();
    scope.uploadedFiles = {};
    scope.indexedFiles = {};
    scope.tableHeads = [];
    scope.recentlyIndexed = scope.newIndex.getRecentlyIndexed();
    scope.searchString = document.getElementById('search').innerHTML;

    scope.indexInLocalStorage = scope.newIndex.indexInLocalStorage();

    scope.displayCreate = false;
    scope.displayIndex = false;

    scope.isEmpty = (object) => {
      const objectIsEmpty = Object.keys(object).length === 0;
      return objectIsEmpty;
    };

    function displayMessage(message) {
      scope.message = message;
      $('#response-modal').modal();
      scope.$evalAsync();
    }

    scope.readFile = (inputDom) => {
      const files = [];
      for (let i = 0; i < inputDom.target.files.length; i += 1) {
        files.push(inputDom.target.files[i]);
      }

      files.forEach((file) => {
        const fileName = file.name;

        try {
          scope.newIndex.readFile(file, fileName).then((content) => {
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
        const createdIndex = scope.newIndex
                              .createIndex(fileChoice, scope.uploadedFiles[fileChoice]);
        scope.indexedFiles[fileChoice] = createdIndex[0];
        scope.justIndexed = createdIndex[1];
        const indexedFilesList = Object.keys(scope.indexedFiles);

        scope.tableHeads = scope.newIndex.getTitles(scope.uploadedFiles[fileChoice]);
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

    scope.searchIndex = () => {
      scope.searchResult = {};

      if (scope.fileToSearch === 'All Files') {
        scope.searchResult = scope.newIndex.searchIndex('All Files', scope.searchString, scope.indexedFiles);
        scope.displayIndex = false;
        scope.allFiles = true;
      } else {
        scope.searchResult[scope.fileToSearch] =
                scope.newIndex.searchIndex(scope.fileToSearch, scope.searchString);
      }

      scope.displayIndex = false;
    };

    scope.getIndex = (fileName) => {
      scope.indexedFiles[fileName] = scope.newIndex.getIndex(fileName)[0];
      scope.uploadedFiles[fileName] = [scope.indexedFiles[fileName]];
      scope.justIndexed = fileName;

      const indexedFilesList = Object.keys(scope.indexedFiles);
      scope.tableHeads = scope.newIndex.getIndex(fileName)[1];
      scope.fileToSearch = indexedFilesList[indexedFilesList.length - 1];

      if (indexedFilesList.length > 1) {
        scope.moreThanOneIndexed = true;
      }

      scope.displayCreate = false;
      scope.displayIndex = true;
    };

    // scope.deleteIndex = (fileName) => {
    //   scope.newIndex.deleteIndex(fileName);
    // }
  });
})();
