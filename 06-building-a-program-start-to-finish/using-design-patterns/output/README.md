### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...)
- **With**: *independently*

#### Design Patterns Used

#### MVC
MVC is an achitectural pattern that is used to separate an application's concerns. That is, application code is broken into three layers:
- *Model* - represents an object carrying data. e.g. `InvertedIndex Class`
- *View* - represents the front end view of the data that model contains. e.g. `index.html`
- *Controller* - acts on both model and view. It controls the data flow into model object and updates the view whenever data changes. e.g. `indexController.js`

Hence as explained above, in the case of the Inverted Index App, the model is the `InvertedIndex Class`, the view is the front end HTML and CSS, while the controller is the JavaScript app and the associated `inverted.js`.

#### Constructor Pattern
Constructors are special methods used to create specific types of objects both preparing the object for use and accepting arguments during instatntiation which can then be used to set the values of member properties and methods when the object is first created.
The `InvertedIndex Class` makes explicit use of the constructor design pattern in that, to create an instance of the class, a constructor function must be called which initializes the indexes object that holds a hashmap of all the indexes create from the uploaded files.

```javascript
class InvertedIndex {

  constructor() {
    this.indexedFiles = {};
  }

  readFile(eachFile) {

  }

  createIndex(book, filename) {

  }

```
To use the methods of the object you first have to create an instance of the class by doing: 
`invertedIndex = new InvertedIndex()`

#### AUTHOR
- **Faith Mustapha**