app.controller('ProfileController',
function profileCtrl($scope, $http, $rootScope, $location, $timeout) {
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
              $timeout(() => {
                $scope.uploadedFiles.push({
                  name: files[i].name,
                  data: fileData
                });
              }, 200);
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
    if ($rootScope.currentUser) {
      if (localStorage.getItem(`${$rootScope.currentUser._id}-index`)) {
        const indexData = JSON.parse(localStorage.getItem(
          `${$rootScope.currentUser._id}-index`));
        $scope.invertedIndex = $scope.unserialize(indexData);
        $scope.uploadedFileNames = {};
        $scope.invertedIndex.fileNames.forEach((fileName) => {
          $scope.uploadedFileNames[fileName] = false;
        });
      } else {
        $scope.readFromDatabase();
      }
    }
  });
  $scope.indexFiles = () => {
    if (!$scope.filesAreUploaded()) {
      $scope.alert('There are no uploaded files to be indexed.');
    } else {
      $scope.uploadedFiles.forEach((file) => {
        if (!$scope.invertedIndex) {
          $scope.invertedIndex = new InvertedIndex();
        }
        $scope.invertedIndex.createIndex(file.data, file.name);
        if (!$scope.uploadedFileNames) {
          $scope.uploadedFileNames = {};
        }
        $scope.invertedIndex.fileNames.forEach((fileName) => {
          $scope.uploadedFileNames[fileName] = false;
        });
      });
      $scope.uploadedFiles = [];
      if ($rootScope.currentUser) {
        localStorage.setItem(`${$rootScope.currentUser._id}-index`,
        $scope.serialize());
      }
    }
  };
  $scope.showIndex = (fileName) => {
    $scope.currentFileName = fileName;
    $scope.currentTitles = $scope.invertedIndex.getTitles(fileName);
    $scope.currentIndex = $scope.invertedIndex.getIndex(fileName);
    $('#viewindex').modal('open');
  };
  $scope.search = () => {
    if (!$scope.keywords ||
    InvertedIndex.tokenize($scope.keywords).length === 0) {
      $scope.alert('Please enter a keyword(s) to search for.');
    } else {
      $scope.filesToSearch = [];
      Object.keys($scope.uploadedFileNames).forEach((fileName) => {
        if ($scope.uploadedFileNames[fileName]) {
          $scope.filesToSearch.push(fileName);
        }
      });
      if ($scope.filesToSearch.length === 0) {
        $scope.alert('Please select at least one file to be searched');
      } else {
        $scope.searchResults = $scope.invertedIndex
          .searchIndex($scope.keywords, $scope.filesToSearch);
        let isFound = false;
        Object.keys($scope.searchResults.results).forEach((token) => {
          if ($scope.searchResults.results[token].length > 0) {
            isFound = true;
          }
        });
        if (isFound) {
          $('#viewsearchresults').modal('open');
        } else {
          $scope.alert(`"${$scope.keywords}" not found in any selected files.`);
        }
      }
    }
  };
  $scope.saveToDatabase = (fileName) => {
    $(`#checkbox-${$scope.getValidID(fileName)}-preloader`).addClass('active');
    $http.post('/saveIndex', {
      username: $rootScope.currentUser.username,
      fileName,
      titles: $scope.invertedIndex.getTitles(fileName),
      index: $scope.invertedIndex.getIndex(fileName),
    }).then((res) => {
      $(`#checkbox-${$scope.getValidID(fileName)}-preloader`)
        .removeClass('active');
      if (res.status === 201) {
        $scope.alert(`${fileName} saved to cloud successfully!`);
      } else if (res.status === 204) {
        $scope.alert(`${fileName} has already been saved to cloud!`);
      }
    }, (err) => {
      $(`#checkbox-${$scope.getValidID(fileName)}-preloader`)
        .removeClass('active');
      Materialize.toast(err.message, 5000, 'red rounded');
    });
  };
  $scope.readFromDatabase = () => {
    $http.post('/readIndex', {
      username: $rootScope.currentUser.username,
    }).then((res) => {
      if (res.data) {
        $scope.invertedIndex = $scope.unserialize(res.data);
        $scope.uploadedFileNames = {};
        $scope.invertedIndex.fileNames.forEach((fileName) => {
          $scope.uploadedFileNames[fileName] = false;
        });
      }
    }, (err) => {
      Materialize.toast(err.message, 5000, 'red rounded');
    });
  };
  $scope.deleteFromDatabase = (fileName) => {
    $(`#checkbox-${$scope.getValidID(fileName)}-preloader`).addClass('active');
    $http.post('/deleteIndex', {
      username: $rootScope.currentUser.username,
      fileName
    }).then((res) => {
      $(`#checkbox-${$scope.getValidID(fileName)}-preloader`)
        .removeClass('active');
      if (res.status === 201) {
        $scope.alert(`${fileName} deleted from cloud successfully!`);
      } else if (res.status === 200) {
        $scope.alert(`${fileName} has already been deleted from cloud!`);
      }
    }, (err) => {
      $(`#checkbox-${$scope.getValidID(fileName)}-preloader`)
        .removeClass('active');
      Materialize.toast(err.message, 5000, 'red rounded');
    });
    $('.tooltipped').tooltip('remove');
  };
  $scope.deleteFromAll = (fileName) => {
    $scope.invertedIndex.removeIndex(fileName);
    if ($rootScope.currentUser) {
      localStorage.setItem(`${$rootScope.currentUser._id}-index`,
        $scope.serialize());
      $scope.deleteFromDatabase(fileName);
    }
    $('.tooltipped').tooltip('remove');
  };
  $scope.alert = (message) => {
    document.getElementById('alertMessage').innerHTML = message;
    $('#alert').modal('open');
  };
  $scope.getValidID = str => (str.replace(/[. ]/g, '_'));
  $scope.serialize = () => (
    JSON.stringify({
      fileNames: $scope.invertedIndex.fileNames,
      titles: $scope.invertedIndex.titles,
      indices: $scope.invertedIndex.indices
    })
  );
  $scope.unserialize = (data) => {
    const invertedIndex = new InvertedIndex();
    invertedIndex.fileNames = data.fileNames;
    invertedIndex.titles = data.titles;
    invertedIndex.indices = data.indices;
    return invertedIndex;
  };
  $scope.filesAreUploaded = () => {
    if ($scope.uploadedFiles.length > 0) {
      return true;
    }
    return false;
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
