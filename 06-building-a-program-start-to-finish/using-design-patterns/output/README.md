#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...)
- **With**: *independently*

#### Design Patterns used

###### Publisher-Subscriber Pattern

In this pattern, senders of messages, called publishers, do not program the messages to be sent directly to specific receivers, called subscribers, but instead just broadcasts messages without knowledge of which subscribers, if any, there may be.

This pattern is especially useful in applications that require interaction with the user, as a user's event triggers an action to be executed.

This block of code acts as the publisher:
###### [dist/js/components/file-menu/file-menu.component.js](https://github.com/andela-iamao/inverted-index/blob/feature/141535091/add-back-funtionality/dist/js/components/file-menu/file-menu.component.js)
```
9   this.createIndex = (filename) => {
10    self.index = true;
11    $rootScope.index_data = { name: filename,
12      data: $rootScope.InvertedIndex.indices[filename],
13      title: this.fetchTitle($rootScope.data[filename]),
14      isFound: this.isFound };
15    $rootScope.$broadcast('setdata'); // Publisher
16  };
```
This block of code acts as the subscriber

###### [dist/js/components/index-table/index-table.component.js](https://github.com/andela-iamao/inverted-index/blob/feature/141535091/add-back-funtionality/dist/js/components/index-table/index-table.component.js)
```
5   $scope.$on('setdata', () => {
6     $scope.dataset = $rootScope.index_data;
7   }); // Subcriber
```


###### Constructor

A constructor is a special method used to initialize a newly created object once memory has been allocated for it.

An example of the constructor pattern being used is in my Inverted Index class:

###### [InvertedIndex.js](https://github.com/andela-iamao/inverted-index/blob/feature/141535091/add-back-funtionality/dist/js/InvertedIndex.js)
```
class InvertedIndex {

  constructor() {
    this.indices = {};
  }
  generateIndex() {
  
  }
  search() {
  
  }
  
  searchAll() {
  
  }
}
```

Here the constructor method, creates an indices property when an instance of the InvertedIndex class is created

```
$rootScope.InvertedIndex = new InvertedIndex();

console.log($rootScope.InvertedIndex.indices);

<<< {}
```
In the above, a new instance of the InvertedIndex class is created and the constructor initializes it with the indices property.