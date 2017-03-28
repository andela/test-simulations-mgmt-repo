#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

#### Design Pattern

#### MVC
Model–View–Controller (MVC) is a software architectural pattern for implementing user interfaces on computers. It divides a given application into three interconnected parts in order to separate internal representations of information from the ways that information is presented to and accepted from the user. The MVC design pattern decouples these major components allowing for efficient code reuse and parallel development.

#### Model
The Model component corresponds to all the data-related logic that the user works with. This can represent either the data that is being transferred between the View and Controller components or any other business logic-related data. In this project the Model is the `InvertedIndex class`

#### View
The View component is used for all the UI logic of the application. For example, it includes all the UI components such as text boxes, dropdowns, etc. that the final user interacts with. In this application, `index.html` is the view.

#### Controller
Controllers act as an interface between Model and View components to process all the business logic and incoming requests, manipulate data using the Model component and interact with the Views to render the final output. The controller will handle all the interactions and inputs from the view `index.html` and update the `indices object`. The same controller will be used to view the generated indices. In this case the controller is the `controller.js` written in AngularJS.

#### Constructor Pattern
A [constructor](https://www.safaribooksonline.com/library/view/learning-javascript-design/9781449334840/ch09s01.html) is a special method used to initialize a newly created object once memory has been allocated for it. In JavaScript, as almost everything is an object, we're most often interested in object constructors. Object constructors are used to create specific types of objects - both preparing the object for use and accepting arguments which a constructor can use to set the values of member properties and methods when the object is first created.

For this application, the `InvertedIndex Class` makes use of the constructor design pattern. To create an instance of the class, we must first call a constructor function.
```
    class InvertedIndex {

      constructor() {
        this.indices = {};
        this.indexedFiles = {};
      }

      createIndex(fileName, file) {

      }

      getIndices(fileName) {

      }

      searchIndices(fileName, query) {

      }
    }
```

A new instance of this class can be created by calling the constructor:
```
const invertedIndex = new InvertedIndex();

invertedIndex.createIndex('books.json', fileContent);

invertedIndex.getIndices('books.json');

invertedIndex.searchIndices('books.json', query);
```