#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...)
- **With**: *independently*

#### Design Patterns used

#### MVC
Model–View–Controller (MVC) is a software design pattern for implementing user interfaces on computers. It divides a given application into three interconnected parts in order to separate internal representations of information from the ways that information is presented to and accepted from the user. The MVC design pattern decouples these major components allowing for efficient code reuse and parallel development. The inverted index application utilizes the MVC pattern as shown bellow
- Model - represents an object carrying data. e.g. The InvertedIndex Class
- View - represents the frontend view of the data that model contains. e.g. index.html, directives.js
- Controller - acts on both model and view. It controls the data flow into model object and updates the view whenever data changes. e.g. homeController
Hence as explained above, in the case of the Inverted Index App, the model is the InvertedIndex Class, the view is the front end HTML and CSS, while the controller is the angular app and the associated homeController.

#### Constructor pattern
A constructor is a special method used to initialize a newly created object once memory has been allocated for it. In JavaScript, as almost everything is an object, we're most often interested in object constructors.
Object constructors are used to create specific types of objects - both preparing the object for use and accepting arguments which a constructor can use to set the values of member properties and methods when the object is first created.

The InvertedIndex Class makes use of the constructor design pattern. To create an instance of the class, a constructor function must be called.
```
    class InvertedIndex {

      constructor() {
        this.filesIndexed = {};
      }

      getIndex(fileName) {

      }

      createIndex(fileName, fileContent) {

      }

      searchIndex(query, fileName) {

      }
    }

```
And we can create a new instance of InvertedIndex by calling the constructor thus:

```
const invertedIndex = new InvertedIndex();

invertedIndex.createIndex('books.json', fileContent);

invertedIndex.getIndex('books.json');

invertedIndex.searchIndex(query, 'books.json');

```
