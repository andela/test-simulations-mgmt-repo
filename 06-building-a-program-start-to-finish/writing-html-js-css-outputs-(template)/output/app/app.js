const invertedIndexApp = angular.module('invertedIndexApp', [])
    .controller('BookController', ['$scope', ($scope) => {
      $scope.invertedIndex = new InvertedIndex();
      $scope.register = [];
      $scope.bookList = [];
      $scope.indexRegister = [];
      $scope.bookNames = [];
      $scope.library = [];
      $scope.mainIndex = {};
      $scope.searchResult = {};
      $scope.buildMessage = '';


      $scope.uploadBooks = (bookFile) => {
        const books = Array.from(bookFile.target.files);
        books.forEach((book) => {
          $scope.$apply(() => {
            if (book.type === 'application/json' &&
             $scope.register.indexOf(book.name) === -1) {
              $scope.register.push(book.name);
              $scope.bookList.push(book);
              $scope.uploadStatus = true;
              $scope.message = 'Upload successful';
            } else {
              $scope.badMessage = `This file is
              not a JSON file or It is already uploaded!`;
            }
          });
        });
        return status;
      };

      $scope.buildIndex = (file) => {
        if (!file) {
          $scope.buildMessage = 'Select a file to generate an index';
        } else if ($scope.indexRegister.indexOf(file.name) !== -1) {
          $scope.buildMessage = 'Book already has index';
        } else {
          const reader = new FileReader();
          reader.readAsText(file);
          let newbook = {};
          const index = new InvertedIndex();
          reader.onload = (e) => {
            try {
              newbook = JSON.parse(e.target.result);
              index.buildIndex(newbook);
              $scope.invertedIndex.buildIndex(newbook);
              $scope.indexRegister.push(file.name);
              $scope.mainIndex = $scope.invertedIndex.mainIndex;
              $scope.newIndex = index.mainIndex;
              $scope.bookNames = index.bookNames;
              $scope.library = $scope.invertedIndex.bookNames;
              $scope.buildStatus = true;
              $scope.words = 'Words';
            } catch (err) {
              $scope.buildMessage = 'File is Invalid';
            }
            document.getElementById('index-table').style.display = 'block';
          };
        }
      };

      $scope.search = (query) => {
        if (!query) {
          $scope.badMessage = 'Enter a word to search';
        } else {
          const words = query.split(' ');
          words.forEach((word) => {
            if ($scope.buildStatus) {
              $scope.searchResult[word] = $scope.invertedIndex
              .searchIndex(word);
            } else {
              $scope.badMessage = `Index not
              Created yet! Create Index to begin`;
            }
          });
        }
      };


      document.getElementById('bookFile')
      .addEventListener('change', $scope.uploadBooks);
    }]);
