#### Design Patterns Used

### MVC
The Model-View-Controller (MVC) is a fundamental design pattern that classifies an application into the modeling of the domain, the presentation, and the actions based on user input.

A model is an object representing data. The Model component is composed of all data-related logic that the user works with in the application. In the case of this work, the application has no model because it is a front-end application and has no database. However it can be assumed that the invertedIndexClass is a model because it encapsulates all data related logic the user works with in this application.

A view is some form of visualization of the state of the model. The View component is used to present all the user interface (UI) logic of the application. In the case of this application the index.html and CSS(style.css) make up the view.

A controller is responsible for providing responses to the state of the model.The controller component serves as a middleware between the model and the view. it accepts and processes all the incoming requests, manipulates data and returns final output to the view. In the case of this application the invertedIndexClass is the controller.

### Constructor Pattern
The constructor method is a special method used for initializing an object created with a class. In Javascript, Objects are widely used which makes object constructors more relevant. In this work, a constructor method was used with the keyword 'this' which references the new object that is being created.

  constructor() {
    this.files = {};
    this.indexTable = {};
  }
  The InvertedIndex Class employed the constructor design pattern to create instances of the class. A constructor function was called in the createIndex which returns all indeces, filename and inputData in the createIndex method.
  
  this.indexTable[fileName][word]


