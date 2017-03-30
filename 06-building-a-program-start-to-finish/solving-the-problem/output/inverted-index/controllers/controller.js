iDexApp.controller('iicontroller', ['$scope', '$localStorage', 'toastr', 'Utility', ($scope, $localStorage, toastr, Utility) => {
  const iDex = new InvertedIndex();

  $scope.bookTitles = [];
  $scope.iiScopeHolder = {};
  $scope.numberOfDocuments = iDex.numberOfDocuments;
  $scope.books = iDex.unIndexedBooks;
  $scope.showIndexes = false;
  $scope.showSearches = false;

  $scope.toggleSort = () => {
    $scope.showIndexes = false;
    $scope.iiScopeHolder = Utility.toggleSort($scope.iiScopeHolder);
    $scope.showIndexes = true;
    Utility.toggleSortInnerText('toggele-sortB', 'toggele-sort');
  };

  $scope.doUpload = (books, booksLength, formField) => {
    /**
     * TODO: Replace for loop with a es6 like syntax
     */
    for (let booksIndex = 0; booksIndex < booksLength; booksIndex += 1) {
      const bookNameWithoutExtension = books[booksIndex].name.split('.')[0].toLowerCase();
      if (books[booksIndex].name.split('.').pop() !== 'json') {
        // eslint-disable-next-line no-param-reassign
        formField.value = '';
        return Utility.feedback('Invalid file type. Only a .JSON file is allowed');
      }
      if ($scope.bookTitles.includes(bookNameWithoutExtension)) {
        return toastr.warning('File has already been uploaded', 'Already uploaded');
      }

      $scope.readFile(books[booksIndex])
        .then((result) => {
          Object.keys(result).map((bookname) => {
            iDex.unIndexedBooks[bookname] = result[bookname];
            if (books[booksIndex]) {
              $scope.$apply(() => {
                $scope.bookTitles.push(bookNameWithoutExtension);
              });
              toastr.success(`${bookname} upload is successful`);
              document.getElementById('create-index').innerText = 'Ready to create an iDex';
            }
          });
        })
        .catch((error) => {
        // eslint-disable-next-line no-param-reassign
          formField.value = '';
          return Utility.feedback(error);
        });
    }
  };

  $scope.readFile = book => new Promise((resolve, reject) => {
    if (window.FileReader) {
      const bookReader = new FileReader();
      bookReader.onload = (() => (readerObj) => {
        try {
          const bookname = book.name;
          const allBooks = iDex.readFile(readerObj.target.result);
          iDex.validateFile(allBooks, bookname)
            .then(bookHolder => resolve(bookHolder))
            .catch(error => reject('This is not a valid json file\n Please get one with a vaild title and text properties'));
        } catch (error) {
          reject(`${book.name} is not a valid .json file.
          Use a .json file with a "title" and "text" properties
          Upload cancelled`);
        }
      })(book);
      bookReader.readAsText(book);
    } else {
      reject('The FileReader API is not supported in this browser. \nUpdate your browser');
    }
  });

  $scope.buildIndex = () => {
    if ($scope.selectedBook === undefined) return Utility.feedback('Please select a book to index');

    $scope.showIndexes = true;
    $scope.showSearches = false;

    const uploadedBookName = $scope.selectedBook;

    if (uploadedBookName === 'allBooks') {
      // TODO: Build index for multiple books
      Utility.feedback('Unsupported.\n You can\'t create index for multiple files at the moment.');
      toastr.warning('That feature is not yet implemented.', 'Unsupported');
      $scope.showIndexes = false;
    } else if (Object.keys(iDex.iDexMapper).indexOf(uploadedBookName) > -1) {
      $scope.iiScopeHolder = iDex.getIndex(uploadedBookName);
      $scope.numberOfDocuments[uploadedBookName] = iDex.numberOfDocuments[uploadedBookName];
      Utility.toggleSortInnerText('toggele-sort', 'toggele-sortB');
    } else {
      const book = $scope.books[uploadedBookName];
      $scope.numberOfDocuments[uploadedBookName] = [];
      iDex.createIndex(uploadedBookName, book).then(result => result);
      $scope.iiScopeHolder = iDex.getIndex(uploadedBookName);
      $scope.numberOfDocuments[uploadedBookName] = iDex.numberOfDocuments[uploadedBookName];
      Utility.newlyCreatedIndexInnerText();
    }
  };

  $scope.doSearch = () => {
    if (!($scope.bookToSearch)) return iDex.feedback('Select an indexed book before search');
    const searchToken = $scope.searchToken;
    const searchTokens = iDex.tokenize(searchToken);
    const bookToSearch = $scope.bookToSearch;

    $scope.showSearches = true;
    $scope.showIndexes = false;
    $scope.searchResult = iDex.searchIndex(bookToSearch, searchTokens);
  };

  $scope.clickSearch = () => {
    if (!($scope.searchToken)) return Utility.feedback('A word must be entered to search');
    $scope.doSearch();
  };

  $scope.doLiveSearch = () => {
    if ($scope.searchToken.length > 3 && $scope.liveSearch === true) {
      $scope.doSearch();
    } else {
      $scope.searchResult = [];
    }
  };

  $scope.createIndexButtonText = () => {
    const uploadedBookName = $scope.selectedBook;
    if (Object.keys(iDex.iDexMapper).indexOf(uploadedBookName) !== -1) {
      document.getElementById('create-index').innerText = 'Already indexed';
    } else {
      document.getElementById('create-index').innerText = 'Get indexes';
      $scope.showIndexes = false;
    }
    $scope.iiScopeHolder = iDex.getIndex(uploadedBookName);
  };

  $scope.searchIndexButtonText = () => {
    $scope.showIndexes = false;
    const bookName = $scope.bookToSearch;
    document.getElementById('search-idex').innerText = `Search ${bookName}`;
  };

  $scope.saveAllData = () => {
    if (Object.keys(iDex.iDexMapper).length < 1) {
      Utility.feedback('Please index a book before trying to save');
      toastr.error('Please index a book before trying to save', 'Error');
      return;
    }
    $localStorage.savedBooks = {};
    $localStorage.numberOfDocuments = {};
    $localStorage.savedBooks = iDex.iDexMapper;
    $localStorage.numberOfDocuments = iDex.numberOfDocuments;
    toastr.success('All data have been saved to local storage.', 'Success');
  };

  $scope.loadAllData = () => {
    if (!($localStorage.savedBooks) || Object.keys($localStorage.savedBooks).length < 1) {
      toastr.error('Sorry bro, no data has been saved.', 'Error');
    } else if (Object.keys(iDex.iDexMapper).length > 0) {
      toastr.warning('All data have been loaded to workspace.', 'Warning');
    } else {
      iDex.iDexMapper = $localStorage.savedBooks;
      iDex.numberOfDocuments = $localStorage.numberOfDocuments;
      $scope.numberOfDocuments = iDex.numberOfDocuments;
      $scope.books = iDex.iDexMapper;

      Object.keys(iDex.iDexMapper).map((bookname) => {
        $scope.bookTitles.push(bookname);
      });
      toastr.success('All data have been loaded to workspace.', 'Success');
    }
  };

  $scope.deleteAllData = () => {
    if (!($localStorage.savedBooks) || Object.keys($localStorage.savedBooks).length < 1) {
      toastr.error('Sorry bro, no data has been saved.', 'Error');
    } else {
      $localStorage.savedBooks = {};
      iDex.iDexMapper = {};
      $localStorage.numberOfDocuments = {};
      iDex.numberOfDocuments = {};
      $scope.books = {};
      toastr.warning('All data have been deleted from local storage.', 'Warning');
    }
  };
}]);


document.addEventListener('DOMContentLoaded', () => {
  const bookUploader = document.getElementById('book-uploader');
  bookUploader.addEventListener('change', () => {
    const books = bookUploader.files;
    const booksLength = books.length;
    angular.element(document.getElementById('book-uploader')).scope().doUpload(books, booksLength, bookUploader);
  }, false);
});
