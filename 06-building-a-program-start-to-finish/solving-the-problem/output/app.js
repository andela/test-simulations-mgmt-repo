angular.module('root', ['ngAnimate', 'toastr'])
  .controller('invertedController', ($scope, toastr) => {
    const invertedIndex = new InvertedIndex();
    $scope.docsMock = [];
    $scope.indexedFile = {};
    $scope.fileStore = {};
    $scope.fileNames = [];
    $scope.table1 = false;
    $scope.table2 = false;
    $scope.searchAll = {};

    $scope.createIndex = () => {
      $scope.isSearching = false;
      const getSelectedFile = document.getElementById('uploadedFilesSelect');
      $scope.uploadedFileName =
      getSelectedFile.options[getSelectedFile.selectedIndex].text;
      if ($scope.uploadedFileName === '') {
        toastr.error('Please select a file and click Create index', 'Error');
      }
      const selectedFile = $scope.fileStore[$scope.uploadedFileName];
      const uniqueTerms =
      InvertedIndex.getText(selectedFile);
      const fileName = $scope.uploadedFileName;
      invertedIndex.createIndex(selectedFile, fileName);
      $scope.indexedFile = invertedIndex.getIndex($scope.uploadedFileName);
      $scope.docsMock = $scope.indexedFile[uniqueTerms[0]];
      $scope.docsMockTrue = true;
      $scope.table1 = true;
      $scope.table2 = false;
    };

    $scope.searchIndex = () => {
      $scope.isSearching = true;
      $scope.searchKey = '';
      const getSearchFile = document.getElementById('uploadedFilesSearch');
      $scope.searchFileName =
      getSearchFile.options[getSearchFile.selectedIndex].text;
      $scope.indexedFile = invertedIndex.getIndex($scope.searchFileName);
      if (angular.isUndefined($scope.indexedFile) &&
      $scope.searchFileName !== 'all') {
        toastr.info('You must Create the Index of a file to search it', 'Info');
        $scope.docsMockTrue = false;
      } else if ($scope.searchFileName === 'all') {
        $scope.searchAll = invertedIndex.searchIndex('', 'all');
        $scope.table1 = false;
        $scope.table2 = true;
      } else {
        $scope.table2 = false;
        $scope.table1 = true;
        const getFileName = $scope.fileStore[$scope.searchFileName];
        const uniqueTerms = InvertedIndex.getText(getFileName);
        $scope.docsMock = $scope.indexedFile[uniqueTerms[0]];
      }
    };

    $scope.processFile = fileStore => new Promise((resolve, reject) => {
      const fileInput = document.getElementById('fileInput');
      const fileLength = fileInput.files.length;
      if (fileLength === 0) {
        toastr.error('select a valid JSON file and click Upload', 'Error');
      }
      for (let i = 0; i < fileLength; i += 1) {
        const fileName = fileInput.files[i].name;
        $scope.panelName = fileName;
        const file = fileInput.files[i];
        $scope.readFile(file)
          .then((response) => {
            const fileContent = angular.fromJson(response);
            const validate = InvertedIndex.validateFile(fileContent);
            const validationStatus = validate.valid;
            if (validationStatus) {
              fileStore[file.name] = fileContent;
              document.getElementById('uploadedFilesSelect')
                .style.display = 'block';
              toastr.success(`${fileName} has been uploaded`, 'File Uploaded');
              resolve(fileStore);
            } else {
              toastr.error(`${fileName} is an invalid JSON file`, 'Error');
              reject(fileStore[file.name]);
            }
          })
          .catch(() => {
            toastr.error(`${fileName} is an invalid JSON file`, 'Error');
          });
      }
    });

    $scope.getDocIndex = (fileName) => {
      const unique = Object.keys($scope.searchAll[fileName])[0];
      $scope.AllDocLength = $scope.searchAll[fileName][unique];
      return $scope.AllDocLength;
    };

    $scope.readFile = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          reject(false);
        }
      };
      reader.readAsText(file);
    });

    $scope.uploadFile = () => {
      $scope.processFile($scope.fileStore)
        .then((result) => {
          $scope.$apply(() => {
            $scope.fileNames = Object.keys(result);
          });
        })
        .catch(() => {
        });
    };

    $scope.filteredData = (keyword) => {
      let fileName;
      if (!$scope.isSearching) {
        fileName = $scope.uploadedFileName;
      } else {
        fileName = $scope.searchFileName;
      }
      return invertedIndex.searchIndex(keyword, fileName);
    };

    $scope.filteredDataAll = {};
    $scope.$watch('searchKey', (newValue) => {
      $scope.filteredDataAll = invertedIndex.searchIndex(newValue, 'all');
    });
  });
