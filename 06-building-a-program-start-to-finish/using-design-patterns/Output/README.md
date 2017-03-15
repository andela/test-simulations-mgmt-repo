### Output 
#### Design Patterns
* A design pattern is a general repeatable solution to a commonly occurring problem in software design.
* Design patterns can speed up the development process by providing tested, proven development paradigms.
* Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability.

#### Design Patterns Used
### Module Design Pattern

``` 
/**
 * Inverted Index class
 */
class InvertedIndex {
/**
 * class constructor
 */
  constructor() {
    this.indices = {};
    this.documentCount = 0;
  }
}
```
Javascript classes are module design patterns. They provide loose coupling which allows for well structured code.

### Observer Design Pattern
``` 
$scope.createIndex = () => {
      const fileName = document.getElementById('createIndexSelect').value;
      const indexToCreate = uploadedFileNames.indexOf(fileName);
      if ($scope.uploadSuccess) {
        newIndex.createIndex(fileName, uploadedFileContent[indexToCreate]);
        $scope.range = [];
        const filedLength = $scope.filed.length;
        for (let docIndex = 0; docIndex < filedLength; docIndex += 1) {
          $scope.range.push(docIndex);
        }
        $scope.indexExists = true;
        $scope.indexObject = newIndex.getIndex(fileName);
      } else {
        $scope.indexExists = false;
        SweetAlert.swal('Error', 'Upload a valid JSON file first.', 'error');
      }
    };
```
Scope is part of the MVC or MVVM architecture. Once the model is change, the view is updated.
### Author
 **Delores Diei**