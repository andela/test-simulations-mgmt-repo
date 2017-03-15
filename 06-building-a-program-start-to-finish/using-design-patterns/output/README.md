#### Output
A Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...)
- **With**: *independently*

#### AUTHOR
- **Henshaw Rowland**

####DESIGN PATTERN USED

#### THE MVC, MVVM or MVP PATTERN 

MVVM (Model View ViewModel) is an architectural pattern based on MVC (Model View Controller) and MVP (, which attempts to more clearly separate the development of user-interfaces (UI) from that of the business logic and behavior in an application. To this end, many implementations of this pattern make use of declarative data bindings to allow a separation of work on Views from other layers.
This facilitates UI and development work occurring almost simultaneously within the same codebase. UI developers write bindings to the ViewModel within their document markup (HTML), where the Model and ViewModel are maintained by developers working on the logic for the application.

The main idea behind the use of this pattern is in its ability to separate concerns which can be seen  between the `Inverted Index` class the angular app and the front-end files.

#### THE CONSTRUCTOR PATTERN 

Constructors are special methods used to create specific types of objects both preparing the object for use and accepting arguments during instatntiation which can then be used to set the values of member properties and methods when the object is first created.
The `InvertedIndex` class makes use of the Constructor pattern in that for you to have access to its properties and methods, you will have to create an instance of it and then use that instance to implement its API.

```

class InvertedIndex {

  constructor() {
    this.mainIndex = {};
    this.bookNames = [];
    this.fileIndex = {};
  }
  getBookText(book) {
  }
  
  buildIndex(books, fileName) {
  }
  
  addIndexToFileIndex(fileName, indexedFile) {
  }
  
  searchAll(searchedWords) {
  }
  
  searchByFile(searchedWords, fileName) {
}

```

To use the methods of the object you first have to create an instance of the class by doing: 

`invertedIndex = new InvertedIndex()`
