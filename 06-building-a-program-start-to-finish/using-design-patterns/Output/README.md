#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

## Targeted Learning Outcomes
## Design Patterns

A design pattern is a general repeatable solution to a commonly occurring problem in software design.
Design patterns can speed up the development process by providing tested, proven development paradigms.
Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability.

## Module Design Pattern
'''
/**
 * Inverted Index class
 */
class Index {
/**
 * class constructor
 */
  constructor() {
    this.index = {};
    this.temp_search = [];
    this.searchResult = {};
    this.allIndex = {};
  }
}
'''

Javascript classes are module design patterns. They provide loose coupling which allows for well structured code.

## Observer Design Pattern

'''
$scope.uploadFile = (file) => {
    file = file.files;
    for (let i = 0; i < file.length; i += 1) {
      const fileExtension = file[i].name.split('.').pop();
      if (fileExtension !== 'json') {
        return toastr.error('This is not a json file');
      }
      if ($scope.fileNames.includes(file[i].name)) {
        return toastr.error(`${file[i].name} has already been uploaded`, 'Error');
      }
      $scope.documents = $scope.fileNames.push(file[i].name);
      $scope.showUploaded = true;
      // $scope.$apply($scope.documents);
      $scope.$apply();
      toastr.success(`${file[i].name} uploaded successfully`, 'Success');

      const reader = new FileReader();
      reader.onload = () => {
        $scope.fileContent[file[i].name] = reader.result;
        $scope.$apply();
      };
      reader.readAsText(file[i]);
    }
  };
'''
Scope is part of the MVC or MVVM architecture. Once the model is change, the view is updated.

## Author
### Omokaro Faith