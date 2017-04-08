#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

#### Design Pattern

#### MVC
Model–View–Controller (MVC) is a software architectural pattern for implementing user interfaces on computers. It divides a given application into three interconnected parts in order to separate internal representations of information from the ways that information is presented to and accepted from the user. The MVC design pattern decouples these major components allowing for efficient code reuse and parallel development.

#### Model
The Model component represents all the data-related logic that the user works with, it can also have logic to update controller if its data changes. This can represent either the data that is being transferred between the View and Controller components or any other business logic-related data. In this project the Model is the `InvertedIndex class`

#### View
The View component epresents the visualization of the data that model contains, it is used for all the UI logic of the application. It includes all the UI components such as divs, dropdowns, etc. that the user interacts with. In this application, `index.html` is the view.

#### Controller
Controllers acts on both the model and view. It controls the data flow into the model object and updates the view whenever it's data changes. It keeps the view and model separate. The controller will handle all the interactions and inputs from the view `index.html` and update the `index object`. The same controller will be used to view the generated indexes. In this case the controller is the `app.js` written in AngularJS, and the associated invertedController.

#### Benefits of MVC
- It supports Code reuse
- It supports Simultaneous development
- It Supports seperation of concerns
- It Improves code readability and maintainability


#### Constructor Pattern
A constructor in a class is a special type of subroutine called to create an object. It prepares the new object for use, often accepting arguments that the constructor uses to set required member variables. Constructors often have the same name as the declaring class. They have the task of initializing the object's data members and of establishing the invariant of the class, failing if the invariant is invalid. Immutable objects must be initialized in a constructor.

For this application, the `InvertedIndex Class` makes use of the constructor design pattern. To create an instance of the class, we must first call a constructor function.
```
    class InvertedIndex {

      constructor() {
        this.unique = [];
        this.tableObj = {};
      }

      createIndex(fileJsonObject, uniqueTerms, fileName) {

      }

      getIndex(fileName) {

      }

      searchIndex(keywords, fileName) {

      }
    }
```

A new instance of this class can be created by calling the constructor:
```
const invertedIndex = new InvertedIndex();

invertedIndex.createIndex(fileObject,['ali','in','lagos'] ,'books.json');

invertedIndex.getIndex('books.json');

invertedIndex.searchIndex(query, 'books.json');
```
