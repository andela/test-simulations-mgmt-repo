const myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', ($scope) => {
  $scope.index = new InvertedIndex();

  $scope.searchResult = {};
  $scope.indexed = {};

  $scope.deleteFileIndex = (filename) => {
    if ($scope.index.deleteFileIndex(filename)) {
      $scope.show('all');
      $scope.flash('Deleted');
    }
  };

  // Displays an appropriate table
  $scope.show = (text) => {
    if (text === 'all') {
      $scope.indexed = $scope.index;
      $scope.show('index');
    }
    if (text === 'index') {
      $scope.showIndex = true;
    }
    if (text === 'search') {
      $scope.showIndex = false;
      $scope.showSearch = true;
    }
    if (text === 'none') {
      $scope.showSearch = false;
      $scope.showIndex = false;
    }

    // Adds tooltips to book headings
    setTimeout(() => {
      $('[data-toggle="tooltip"]').tooltip();
    }, 300);
  };

  // display a file's index
  $scope.getIndex = (filename) => {
    const result = { files: {} };
    result.files[filename] = $scope.index.getIndex(filename);
    if (result.files[filename]) {
      result.filenames = [filename];
      $scope.indexed = result;
      $scope.show('index');
    }
  };

  // Reads uploaded file and creates the index
  $scope.readFile = (fileInput, resolve, reject) => {
    const file = fileInput[0].files[0];
    if (!file) return reject();
    const fileType = /json$/;
    const reader = new FileReader();
    if (!file.type.match(fileType)) return reject('Not a JSON file');

    reader.readAsText(file);
    let result;
    reader.onload = () => {
      fileInput.val('');
      try {
        result = JSON.parse(reader.result);
      } catch (error) {
        return reject('Invalid JSON file');
      }

      // Validate file content
      if (!InvertedIndex.validateFile(result)) {
        return reject('Invalid File Format');
      }
      if (!$scope.index.createIndex(result, file.name)) {
        return reject('File already exists');
      }
      $scope.show('none');
      return resolve();
    };
  };

  // Calls search when enter key is pressed
  $scope.searchOnEnter = (event, searchKey) => {
    if (event.which === 13 && searchKey) {
      $scope.search(searchKey);
    }
  };

  $scope.verifyWord = (check) => {
    if (check) return 'check-square-o';
    return 'close';
  };

  $scope.flash = (message, type) => {
    if (type === 'error') {
      $('.alert-danger').html(message);
      $('.alert-danger').fadeIn().delay(800).slideUp();
      return;
    }
    $('.alert-success').html(message);
    $('.alert-success').fadeIn().delay(800).slideUp();
  };

  $scope.search = (searchKey) => {
    const filename = $('#searchFilename').val();
    let result = {};
    if (filename && filename !== 'all') {
      result = $scope.index.searchIndex(searchKey, filename);
    } else {
      result = $scope.index.searchIndex(searchKey);
    }
    if (!result) return $scope.flash('Not found', 'error');
    $scope.searchResult = result;
    $scope.show('search');
  };

  // Upload file and read it's content
  const fileInput = $('#fileInput');
  fileInput.on('change', () => {
    const promise = new Promise((resolve, reject) => {
      $scope.readFile(fileInput, resolve, reject);
    });
    promise.then(() => {
      $scope.$apply(() => {
        $scope.flash('File added!');
      });
    }, (error) => {
      $scope.flash(error, 'error');
    });
  });
}]);

$(document).ready(() => {
  // Add event listeners
  $('[data-toggle="tooltip"]').tooltip();
  $('.show-about').click(() => {
    $('#help').slideUp();
    $('#about').slideToggle();
  });
  $('.show-help').click(() => {
    $('#about').slideUp();
    $('#help').slideToggle();
  });
});
