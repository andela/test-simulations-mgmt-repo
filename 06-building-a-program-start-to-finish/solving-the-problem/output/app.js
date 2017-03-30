angular.module('root', ['ngAnimate', 'toastr'])
  .controller('invertedController', ($scope, toastr) => {
    const invertedIndex = new InvertedIndex();
    $scope.docsMock = [];
    $scope.indexedData = {};
    $scope.fileStore = {};
    $scope.fileNames = [];
    $scope.table1 = false;
    $scope.table2 = false;
    $scope.searchAll = {};

    /**
     * A method to generate the index of the file you selected
     */
    $scope.createIndex = () => {
      $scope.isSearching = false;
      const getSelectedFile = document.getElementById('uploadedFilesSelect');
      $scope.uploadedFileName = getSelectedFile.options[getSelectedFile.selectedIndex].text;
      if ($scope.uploadedFileName === '') {
        toastr.error('Please select a file and click Create index', 'Error');
      }
      const selectedFileObj = $scope.fileStore[$scope.uploadedFileName];
      const uniqueTerms = invertedIndex.getTextFromJsonObj($scope.fileStore[$scope.uploadedFileName]);
      invertedIndex.createIndex(selectedFileObj, uniqueTerms, $scope.uploadedFileName);
      $scope.indexedData = invertedIndex.getIndex($scope.uploadedFileName);
      $scope.docsMock = $scope.indexedData[uniqueTerms[0]];
      $scope.docsMockTrue = true;
      $scope.table1 = true;
      $scope.table2 = false;
    };

    /**
     * A method to generate the object of the file you want to search
     */
    $scope.searchIndex = () => {
      $scope.isSearching = true;
      $scope.searchKey = "";
      let getSearchFile = document.getElementById('uploadedFilesSearch');
      $scope.searchFileName = getSearchFile.options[getSearchFile.selectedIndex].text;
      $scope.indexedData = invertedIndex.getIndex($scope.searchFileName);
      if (angular.isUndefined($scope.indexedData) && $scope.searchFileName !== 'all') {
        toastr.info('You must Create the Index a file to be able search through it', 'Info');
        $scope.docsMockTrue = false;
      } else if ($scope.searchFileName === 'all') {
        $scope.searchAll = invertedIndex.searchAllFiles();
        $scope.table1 = false;
        $scope.table2 = true;
        $scope.filteredData($scope.searchKey);
      } else {
        $scope.table2 = false;
        $scope.table1 = true;
        const getFileName = $scope.fileStore[$scope.searchFileName];
        const uniqueTerms = invertedIndex.getTextFromJsonObj(getFileName);
        $scope.docsMock = $scope.indexedData[uniqueTerms[0]];
      }
    };

    /**
     * A method that does the bulk processing of the uploaded-file
     * it reads each uploaded file
     * it validates the file
     * @param  {Object} fileStore the uploaded file object
     */
    $scope.processFile = (fileStore) =>
      new Promise((resolve, reject) => {
        const fileInput = document.getElementById('fileInput');
        const fileLength = fileInput.files.length;
        if (fileLength === 0) {
          toastr.error('Please select a valid JSON file and click Upload File', 'Error');
        }
        for (let i = 0; i < fileLength; i += 1) {
          const fileName = fileInput.files[i].name;
          const file = fileInput.files[i];
          $scope.readFile(file)
            .then((response) => {
              const fileContent = angular.fromJson(response);
              const validate = invertedIndex.validateFile(fileContent);
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
              toastr.error('Empty file', 'Warning', 'Error');
            });
        }
      });

    /**
     * this function gets the number of books in each uploaded file
     * @param  {String} fileName the name of the file
     * @return {Array} of the first key in the selected-file-index
     */
    $scope.getDocIndex = (fileName) => {
      const unique = Object.keys($scope.searchAll[fileName])[0];
      $scope.AllDocLength = $scope.searchAll[fileName][unique];
      return $scope.AllDocLength;
    };

    /**
     * Reads the content of the uploaded JSON file
     * @param  {file} file The uploaded file
     * @return {Promise}  containing the uploaded file
     */
    $scope.readFile = (file) => {
      return new Promise((resolve, reject) => {
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
    };

    /**
     * This method uploads the file, validates it and stores it
     */
    $scope.uploadFile = () => {
      $scope.processFile($scope.fileStore)
        .then((result) => {
          $scope.$apply(() => {
            $scope.fileNames = Object.keys(result);
          });
        });
    };

    /**
     * This method filteres the data that is being types in the search box
     * @param  {String} keyword The string you want to search for
     * @return {Object}         The object of the string you searched for
     */
    $scope.filteredData = (keyword) => {
      let fileName;
      if (!$scope.isSearching){
        fileName = $scope.uploadedFileName;
      } else {
        fileName = $scope.searchFileName;
      }
      return invertedIndex.searchIndex(keyword, fileName);
    }
  });
