#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*


#### Design Patterns Used

#### MVC
Model–View–Controller (MVC) is a software architectural pattern for implementing user interfaces on computers. It divides a given application into three interconnected parts:
- *Model* - represents an object carrying data. e.g. `InvertedIndex Class`
- *View* - represents the front end view of the data that model contains. e.g. `index.html`
- *Controller* - acts on both model and view. It controls the data flow into model object and updates the view whenever data changes. e.g. `app.js`

Hence as explained above, in the case of the Inverted Index App, the model is the `InvertedIndex Class`, the view is the front-end HTML and CSS, while the controller is the angular app.

#### Constructor Pattern
A constructor is a special method used to initialize a newly created object once memory has been allocated for it. 
The `InvertedIndex Class` makes explicit use of the constructor design pattern in that, to create an instance of the class, a constructor function must be called which initializes the `files` object that holds a hashmap of all the indexes created from the uploaded files.
```javascript
class InvertedIndex {
  
  constructor(filenames = [], files = {}) {
    this.filenames = filenames;
    this.files = files;
  }

  static validateFile(fileContent) {

  }

  static tokenize(text) {

  }

  createIndex(fileContent, filename) {

  }
}
```
An we can create a new instance of `InvertedIndex` by calling the constructor thus:
```javascript
const index = new InvertedIndex();

index.validateFile(fileContent);

index.createIndex(fileContent, 'books.json');
```
