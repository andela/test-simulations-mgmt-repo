const app = angular.module('angular', []);
app.controller('index', ['$scope', 'alertFactory', ($scope, alertFactory) => {
  $scope.message = 'About this application!\n\n' +
  "- Click 'Upload File'\n\n" +
   "- Click 'Create Index'\n" +
   '- View indices below/n \n' +
      '- To search through indexed files\n\n' +
       '- Click selectbook dropdown\n' +
      '- Select the file you want to search\n' +
      '- Enter your search term in search box\n\n' +
      '- Separate words in term with a single space\n\n' +
      " -Then click the 'Go'\n";

  $scope.result = '';
  $scope.content = {};
  $scope.docCount = {};
  $scope.titles = {};
  $scope.showIndex = false;
  $scope.showSearch = false;

  const invertedIndex = new InvertedIndex();

  // function to read content from each file and validate JSON content structure
  $scope.validateFiles = () => {
    const badExt = [];
    const goodExt = [];
    const fileInput = document.getElementById('fUpload');
    Object.keys(fileInput.files).forEach((file) => {
      const eachFile = fileInput.files[file];
      if (!eachFile.name.toLowerCase().match(/\.json$/)) {
        badExt.push(eachFile.name);
      } else {
        try {
          goodExt.push(eachFile.name);
          invertedIndex.readFile(eachFile).then((response) => {
            if (response.success) {
              $scope.content[eachFile.name] = response.jsonContent;
              const docTitles = [];
              const count = [];
              let index = 0;
              response.jsonContent.forEach((doc) => {
                docTitles.push(doc.title);
                count.push(index);
                index += 1;
              });
              $scope.titles[eachFile.name] = docTitles;
              $scope.docCount[eachFile.name] = count;
            } else {
              alertFactory.error('Unable to read thatt file', error);
            }
          }).catch((error) => {
            alertFactory.error('Unable to read file', error);
          });
        } catch (error) {
          alertFactory.error(`${eachFile.name} does not have the right structure`);
        }
      }
    });
    badExt.forEach((ext) => {
      alertFactory.error(`Bad Extension: ${ext}`);
    });
    goodExt.forEach((ext) => {
      alertFactory.success(`Good Extension(s): ${ext}`);
    });
  };

  $scope.createBookIndex = () => {
    Object.keys($scope.content).forEach((filename) => {
      try {
        $scope.fileIndices = invertedIndex.createIndex($scope.content[filename], filename);
        $scope.showIndex = true;
        $scope.showSearch = false;
      } catch (err) {
        alertFactory.error('Unsuccessful, please upload a .JSON book', err);
      }
    });
  };

  $scope.searchBookIndex = () => {
    $scope.searchFeedback = {};
    const searchInput = document.getElementById('search').value;
    const searchBook = $scope.bookList;
    if (searchInput === undefined && searchBook !== undefined) {
      searchFeedback = invertedIndex.getIndex(searchBook);
    } else if (searchInput !== undefined && searchBook !== undefined) {
      try {
        $scope.searchFeedback[searchBook] = invertedIndex.searchIndex(searchInput, searchBook);
        $scope.showIndex = false;
        $scope.showSearch = true;
      } catch (err) {
        alertFactory.error('Unable to search file', err);
      }
    } else { return 'Please select a file to search for words'; }
  };
}]);

app.factory('alertFactory', () => ({
  success: (text) => {
    toastr.success(text, 'Success');
  },
  error: (text) => {
    toastr.error(text, 'Error');
  }
}));
