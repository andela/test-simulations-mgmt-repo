app.controller('ProfileController',
function profileCtrl($scope, $http, $rootScope, $location) {
  $scope.uploadedFiles = [];
  $('#jsonfileinput').on('change', function uploadJSON() {
    const files = $(this).get(0).files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i += 1) {
        if (files[i].type !== 'application/json') {
          Materialize.toast(`<b>${files[i].name}</b>&nbsp;is not a JSON file.`,
            3000, 'red rounded');
        } else {
          InvertedIndex.readFile(files[i], (event) => {
            try {
              let fileData;
              try {
                fileData = JSON.parse(event.target.result);
              } catch (err) {
                throw new Error(
                  `<b>${files[i].name}</b>&nbsp;cannot be parsed.`
                );
              }
              if (!InvertedIndex.validateFile(fileData)) {
                throw new Error(
                  `<b>${files[i].name}</b>&nbsp;is not a valid JSON file.`
                );
              }
              $scope.uploadedFiles.push({
                name: files[i].name,
                data: fileData
              });
              Materialize.toast(
                `Successfully uploaded&nbsp;<b>${files[i].name}</b>`,
                3000,
                'green rounded'
              );
            } catch (err) {
              Materialize.toast(err.message, 3000, 'red rounded');
            }
          });
        }
      }
    }
  });
  $scope.$on('$routeChangeSuccess', () => {
    $('.modal').modal();
    $('.modal-overlay').css('display', 'none');
    if (localStorage.getItem(`${$rootScope.currentUser._id}-index`)) {
      const indexData = JSON.parse(localStorage.getItem(
        `${$rootScope.currentUser._id}-index`));
      $scope.invertedIndex = InvertedIndex.unserialize(indexData);
      $scope.uploadedFilenames = {};
      $scope.invertedIndex.filenames.forEach((filename) => {
        $scope.uploadedFilenames[filename] = false;
      });
    } else {
      $scope.readFromDatabase();
      if ($scope.invertedIndex) {
        $scope.uploadedFilenames = {};
        $scope.invertedIndex.filenames.forEach((filename) => {
          $scope.uploadedFilenames[filename] = false;
        });
      }
    }
  });
  $scope.indexFiles = () => {
    if ($scope.uploadedFiles.length === 0) {
      $scope.alert('There are no uploaded files to be indexed.');
    } else {
      $scope.uploadedFiles.forEach((file) => {
        if (!$scope.invertedIndex) {
          $scope.invertedIndex = new InvertedIndex();
        }
        $scope.invertedIndex.createIndex(file.data, file.name);
        if (!$scope.uploadedFilenames) {
          $scope.uploadedFilenames = {};
        }
        $scope.invertedIndex.filenames.forEach((filename) => {
          $scope.uploadedFilenames[filename] = false;
        });
      });
      $scope.uploadedFiles = [];
      localStorage.setItem(`${$rootScope.currentUser._id}-index`,
        $scope.invertedIndex.toJSONString());
    }
  };
  $scope.showIndex = (filename) => {
    $scope.currentFilename = filename;
    $scope.currentTitles = $scope.invertedIndex.getTitles(filename);
    $scope.currentIndex = $scope.invertedIndex.getIndex(filename);
    $('#viewindex').modal('open');
  };
  $scope.search = () => {
    $scope.filesToSearch = [];
    Object.keys($scope.uploadedFilenames).forEach((filename) => {
      if ($scope.uploadedFilenames[filename]) {
        $scope.filesToSearch.push(filename);
      }
    });
    if ($scope.filesToSearch.length === 0) {
      $scope.alert('Please select at least one file to be searched');
    } else {
      $scope.searchResults = $scope.invertedIndex
        .searchIndex($scope.keywords, $scope.filesToSearch);
      if ($.isEmptyObject($scope.searchResults.results)) {
        $scope.alert(`"${$scope.keywords}" not found in any selected files.`);
      } else {
        $('#viewsearchresults').modal('open');
      }
    }
  };
  $scope.saveToDatabase = (filename) => {
    $(`#checkbox-${$scope.getValidID(filename)}-preloader`).addClass('active');
    $http.post('/saveIndex', {
      username: $rootScope.currentUser.username,
      filename,
      titles: $scope.invertedIndex.getTitles(filename),
      index: $scope.invertedIndex.getIndex(filename),
    }).then((res) => {
      $(`#checkbox-${$scope.getValidID(filename)}-preloader`)
        .removeClass('active');
      if (res.status === 201) {
        $scope.alert(`${filename} saved successfully!`);
      } else if (res.status === 204) {
        $scope.alert(`${filename} has already been saved!`);
      }
    }, (err) => {
      Materialize.toast(err.message, 5000, 'red rounded');
    });
  };
  $scope.readFromDatabase = () => {
    $http.post('/readIndex', {
      username: $rootScope.currentUser.username,
    }).then((res) => {
      if (res.data) {
        $scope.invertedIndex = InvertedIndex.unserialize(res.data);
      }
    }, (err) => {
      Materialize.toast(err.message, 5000, 'red rounded');
    });
  };
  $scope.alert = (message) => {
    document.getElementById('alertMessage').innerHTML = message;
    $('#alert').modal('open');
  };
  $scope.getValidID = (str) => {
    return str.replace(/[. ]/g, '_');
  };
  $scope.signout = () => {
    $http.post('/signout')
      .then((res) => {
        if (res.status === 200) {
          $rootScope.currentUser = null;
          $location.url('/');
        }
      }, (err) => {
        Materialize.toast(err.message, 5000, 'red rounded');
      });
  };
});
