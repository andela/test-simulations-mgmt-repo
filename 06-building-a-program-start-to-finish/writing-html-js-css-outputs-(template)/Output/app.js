angular.module('InvertedIndexApp', [])
  .controller('IndexController', ['$scope', ($scope) => {
    const invertedIndex = new InvertedIndex();
    $scope.fileName = null;
    $scope.fileNames = [];
    $scope.indexedFiles = {};
    $scope.displayIndexes = false;
    $scope.displaySearchResult = false;
    $scope.showError = false;
    $scope.errorHandler = '';
    $scope.phrase = '';

    $scope.createIndex = (file) => {
      $scope.fileName = file.name.split('.')[0];
      if (!file.name.toLowerCase().match(/\.json$/)) {
        $scope.showError = true;
        $scope.errorHandler = `${file.name} is not a JSON file.`;
        return;
      }
      InvertedIndex.readFile(file).then((response) => {
        if (response.success) {
          invertedIndex.createIndex($scope.fileName, response.fileToValidate);
          $scope.$apply(() => {
            $scope.fileNames.push(file.name);
          });
        } else {
          $scope.errorHandler = `${file.name} ${response.message}`;
        }
      });
    };

    $scope.displayIndex = () => {
      const filename = $scope.getFile.split('.')[0];
      $scope.indexedFiles = invertedIndex.getIndex(filename);
      $scope.displayIndexes = true;
      $scope.displaySearchResult = false;
    };

    $scope.displaySearch = () => {
      const filename = $scope.searchOption.split('.')[0];
      $scope.searchResults = {};
      if ($scope.phrase.length < 1) {
        $scope.errorHandler = 'Please enter a word to search';
      } else if ($scope.searchOption === 'All') {
        $scope.searchResults = invertedIndex.searchIndex($scope.phrase, filename);
        $scope.displaySearchResult = true;
        $scope.displayIndexes = false;
      } else {
        $scope.searchResults[filename] =
        invertedIndex.searchIndex($scope.phrase, filename)[filename];
        $scope.displaySearchResult = true;
        $scope.displayIndexes = false;
      }
    };
  }])
.filter('range', () => (input, range) => {
  const rangeLength = parseInt(range, 10);
  for (let i = 0; i < rangeLength; i += 1) {
    input.push(i);
  }
  return input;
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('upload')
    .addEventListener('change', function createFile() {
      if (this.files[0]) {
        angular.element(this).scope().createIndex(this.files[0]);
      }
    });
});
