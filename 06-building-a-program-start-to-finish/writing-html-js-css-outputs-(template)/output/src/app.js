
dPlexApp.controller('dPlexController',
  ['$scope', 'toastr', ($scope, toastr) => {
    $scope.title = 'DPlex - Inverted Index for All';
  // Create an object of the class InvertedIndex
    const invertedIndex = new InvertedIndex();
    $scope.uploadedFiles = {};
    $scope.allFlag = false;
    $scope.allFilesIndexed = {};
    $scope.uploadSelected = '';
  /* *
  $scope.createIndex is executed when the createIndex button is clicked
  */
    $scope.createIndex = () => {
    // console.log($scope.uploadedFiles);
      const fileChoice = $scope.uploadSelected;
      if (!fileChoice) {
        toastr.info('Select a file to index');
        return false;
      }
    // If index was created for that file
      if (invertedIndex.createIndex($scope
      .uploadedFiles[fileChoice].text, fileChoice)) {
      // Gets the indexed words
        const indexes = invertedIndex.getIndex(fileChoice);
        $scope.indexDisplay = true;
        $scope.indexed = [
          {
            indexes,
            documents: invertedIndex.getDocuments(fileChoice),
            indexedFile: fileChoice
          }
        ];
      // Keeps track of files that have been indexed
        $scope.allFilesIndexed[fileChoice] = true;
        const fileNamesIndexed = Object.keys($scope.allFilesIndexed);
        $scope.uploadToSearch = fileNamesIndexed[fileNamesIndexed.length - 1];
      /* To check if two files or above have been indexed
      so that an option to search all files can be added*/
        if (Object.keys($scope.allFilesIndexed).length > 1) {
          $scope.allFlag = true;
        }
      } else {
      // The file was not indexed because it is invalid;
        delete $scope.uploadedFiles[fileChoice];
        toastr.error(invertedIndex.error.message);
      }
    };

    $scope.searchIndex = () => {
      const fileChoice = $scope.uploadToSearch;
      $scope.searchQuery = $scope.searchTerm;
      if (!$scope.uploadedFiles
        .hasOwnProperty(fileChoice) && fileChoice !== 'all') {
        toastr.warning('Select a file that has been indexed');
        return false;
      }
      const result = invertedIndex.searchIndex($scope.searchQuery, fileChoice);
      if (!result) {
        toastr.error('Invalid search query');
        return false;
      }
      $scope.indexed = result;
      $scope.indexDisplay = false;
    };
  /**
   * readJson function is used to read the content of a file
   * @param {object} dom - is an object
   * representing the dom element the change event was attached to
   * @return {null} - Does not return anything
  */
    $scope.readJson = (dom) => {
      for (let i = 0; i < dom.target.files.length; i += 1) {
        const fileDetails = dom.target.files[i];
      // check if filename ends in json
        InvertedIndex.readFile(fileDetails).then((content) => {
          $scope.fileContent = content;
          $scope.uploadedFiles[fileDetails.name] = {};
          $scope.uploadedFiles[fileDetails.name].text = $scope.fileContent;
          const fileNames = Object.keys($scope.uploadedFiles);
          $scope.uploadSelected = fileNames[fileNames.length - 1];
          toastr.success('File Uploaded successfully');
        // to make angular update the view
          $scope.$apply();
        }).catch((error) => {
          toastr.error(`File Error: ${error}`);
        });
      }
    };

    $scope.isEmpty = value => Object.keys(value).length === 0;
    document.getElementById('uploadfile')
      .addEventListener('change', $scope.readJson);
  }]);
