#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

#### Targeted Learning Outcomes
- [Patterns (MVC)](https://github.com/andela/learningmap/tree/master/Phase-C/Entry-level%20Developer/Curriculum/23%20-%20Patterns%20(MVC))


#### Using Design Patterns

#### MVC
The Model-View-Controller (MVC) architectural pattern separates an application into three main components: the model, the view, and the controller. Each of these components are built to handle specific development aspects of an application. MVC is one of the most frequently used industry-standard web development framework to create scalable and extensible projects; it is a standard design pattern that many developers are familiar with. 

## Model
Model objects are the parts of the application that implement the logic for the application's data domain. A model stores data that is retrieved according to commands from the controller and displayed in the view. Often, model objects retrieve and store model state in a database. In essence, the Model component corresponds to all the data-related logic that the user works with. This can represent either the data that is being transferred between the View and Controller components or any other business logic-related data. In this project the *Model* is the `InvertedIndex class - *inverted-index.js*`

## View
A view generates new output to the user based on changes in the model. Views are the components that display the application's user interface (UI). Typically, this UI is created from the model data. A view can be any output representation of information, such as a chart, diagram, webpage, etc. Multiple views of the same information are possible, such as a bar chart for management and a tabular view for accountants, or as in this application, `index.html` is the view.

## Controller
The third part, the controller, accepts input and converts it to commands for the model or view. A controller can send commands to the model to update the model's state (e.g., editing a document). It can also send commands to its associated view to change the view's presentation of the model (e.g., scrolling through a document). Controllers are the components that handle user interaction, work with the model, and ultimately select a view to render that displays UI. In an MVC application, the view only displays information; the controller handles and responds to user input and interaction. For example, the controller handles query-string values, and passes these values to the model, which in turn might use these values to query the database. The controller will handle all the interactions and inputs from the view `index.html` and update the `inverted index object`. The same controller will be used to view the generated indexes. In this case the controller is the `app.js` written in AngularJS.

## Constructor Pattern
In object-oriented programming, a class is an extensible program-code-template for creating objects, providing initial values for state (member variables) and implementations of behavior (member functions or methods).
A constructor is a special method used to initialize a newly created object once memory has been allocated for it. In JavaScript, almost everything is an object; we're most often interested in object constructors. Object constructors are used to create specific types of objects - both preparing the object for use and accepting arguments which a constructor can use to set the values of member properties and methods when the object is first created.

For this application, the `InvertedIndex Class` makes use of the constructor design pattern. To create an instance of the class, we must first call a constructor function.
```
    class InvertedIndex {

      constructor() {
        this.allIndexed = {};
      }

      createIndex(file, filename) {

      }

      getIndex(file, filename) {

      }

      tokenize(text) {

      }

      validateFile(file) {

      }

      readFile(fileData) {

      }
      searchIndex(word, filename) {

      }
    }

```

A new instance of this class can be created by calling the constructor:
```
const invIndex = new InvertedIndex();

invdIndex.createIndex(fileDetails, 'file.json');

invIndex.getIndices(fileDetails, 'file.json');

invIndex.searchIndex(wordsToSearchFor, 'file.json');
```
