#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

#### MVC
- MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) traditionally managing logic and user-input. 
- The Model is responsible for carrying data which is the Inverted Index Class
- The View is responsible for displaying data to the end users which is the Index.html
- The Controller acts on both model and view. It controls the data flow into model object and updates the view whenever data changes. which is the app.js

#### Constructor Pattern

Constructors are special methods used to create specific types of objects both preparing the object for use and accepting arguments during instantiation which can then be used to set the values of member properties and methods when the object is first created. The InvertedIndex Class makes explicit use of the constructor design pattern in that, to create an instance of the class, a constructor function must be called which initializes the indexes object that holds a hashmap of all the indexes create from the uploaded files.

``` /**
 * @class InvertedIndex
 * @classdesc blah blah
 */
class InvertedIndex {
  /**
   * * @constructor
   * initialises the class base properties
   */
  constructor() {
    this.indicies = {};
    this.indexedFiles = {};
    this.uploadedFiles = {};
  }
  /**
   * @createIndex method
   * @param {fileName} fileName
   * @param {fileContent} fileContent
   * @returns {boolean}
   * create index of the fileName
   */
  createIndex(fileName, fileContent) {```

To use the methods of the object you first have to create an instance of the class by doing: myClass = new InvertedIndex() then myclass.createIndex();