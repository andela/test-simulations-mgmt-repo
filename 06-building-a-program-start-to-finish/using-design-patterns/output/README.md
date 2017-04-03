#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

#### Design Pattern Used
- **MVC**
Model-View-Controller (MVC) is a design methodology used in Object Oriented Programming (OOP) for successfully and efficiently relating the user interface to underlying data models. The MVC pattern is widely used in program development with programming languages such as Java, Javascript and C++.
The Model-View-Controller pattern proposes three main components or objects to be used in software development:
- *Model* - This represents the underlying logical structure of data in the software. In our case the Inverted Index class i.e. `class InvertedIndex {..}`.

- *View* - The view represents the elements on the user interface: basically everything the user can see and interact with. The view in this project is the `index.html` file.

- *Controller* - The controller accepts input and converts the inputs to commands for the View and Model. In other words, it connects the Model and the View. For our project, it's `MainController`

#### Constructor Pattern
In OOP languages e.g. Javascript, a constructor is a special method used to initialize a newly created object once memory has been allocated for it. 
The `InvertedIndex` class makes explicit use of the constructor design pattern in that, to create an instance of the class, a constructor function must be called which initializes the indexes object that holds a hashmap of all the indexes create from the uploaded files.

```
class InvertedIndex {
  /**
   * Class Constructor
   * @constructor
   */
  constructor() {
    this.allIndices = {};
  }
  /**
   * Reads the data from the file being uploaded
   * @param  {File} file - Uploaded file to be read.
   * @return {void}
   */
  readFile(file) {
    //...
  }
  /**
   * Ensures all the documents in a particular file is valid
   * @param  {String} fileName
   * @param  {Object} fileContent
   * @return {Boolean} isValid -True or false
   */
  validateFile(fileName, fileContent) {
    //...
  }
  /**
   * Strips out special characters from documents to be indexed
   * @param  {String} fileText - String from file to be tokenized
   * @return {Array} An array of unique words
   */
  tokenize(fileText) {
   //...
  }
  /**
   * Creates the index for documents
   * @param  {String} fileName
   * @param  {Array} content
   * @return {Object} this.allIndices object
   */
  createIndex(fileName, content) {
    //...
  }
  /**
   * Get’s indices created for particular files
   * @param  {Object} fileName -Title of input file
   * @return {Object} allIndices
   */
  getIndex(fileName) {
    //...
  }
    /**
   * Searches through one or more indices for words
   * @param  {String} fileName -File name
   * @param  {String} query -Input token
   * @return {Object} searchResult
   */
  searchIndex(fileName, query) {
    //....
  }
}
```
We can create an instance of the class by calling the constructor:

```
const invIndex = new InvertedIndex();

invIndex.createIndex('books', content);

```

#### Author
- _**Oluwafemi Akinwa**_