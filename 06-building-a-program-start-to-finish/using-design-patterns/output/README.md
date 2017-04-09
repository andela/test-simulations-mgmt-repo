### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...)
- **With**: *independently*

### Design Patterns Used

#### MVC
The Model-View-Controller (MVC) is an architectural pattern that separates an application into three main logical components which are built to handle specific development aspects of an application.
- *Model* : The Model component corresponds to all the data-related logic that the user works with. In this case, the `InvertedIndex class`
- *View* : The View component is used for all the user interface (UI) logic of the application. e.g. `index.html`
- *Controller* : The controller interacts between the Model and the View components, it processes all the logic and incoming requests, manipulate data and render final output to the view. e.g. `app.js`

In the case of the inverted index app, the *Model* is the `InvertedIndex class` which contains the methods used for the app, the *View* is the front-end (in HTML and CSS), which is visible to the user and the *Controller* is the app associated with the InvertedIndex class (written in AngularJS) `app.js`

#### Constructor Pattern
The constructor method is a special method for creating and initializing/instantiating an object created with a class. The `InvertedIndex Class` makes explicit use of the constructor design pattern, to create an instance of the class, a constructor function must be called which initializes the indexed object that holds a hashmap of all the indices created from the uploaded files.

```javascript
class InvertedIndex {
  
  constructor() {
    this.fileIndices = {};
  }

  createIndex(fileName, fileContent) {

  }

  searchIndex(searchTerm, filename) {

  }

```
Instantiate the class to use the methods: 
`invertedIndex = new InvertedIndex()`

#### AUTHOR
- **Halimat Mercy Oseni**