#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

## Targeted Learning Outcomes
## Design Patterns

A design pattern is a general repeatable solution to a commonly occurring problem in software design.
Design patterns can speed up the development process by providing tested, proven development paradigms.
Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability.

## Design Pattern Used

## Constructor Pattern

A constructor is a special method used to initialize a newly created object once memory has been allocated for it.

The InvertedIndex Class makes explicit use of the constructor design pattern in that, to create an instance of the class, a constructor function must be called which initializes the indexes object that holds a hashmap of all the indexes create from the uploaded files.

class Index {
  
  constructor() {
    this.index = {};
    this.temp_search = [];
    this.searchResult = {};
    this.allIndex = {};
  }

  validateFile(file) {
    const jsonFile = file;
    let check = {
      status: true,
      msg: 'Valid File',
    };
    try {
      if (typeof file !== 'object' || file.length < 1) {
        check = {
          status: false,
          msg: 'File is empty please upload a new file',
        };
      }
      jsonFile.forEach((key) => {
        if (key.title === undefined || key.text === undefined) {
          check = {
            status: false,
            msg: 'Invalid file content',
          };
        }
      });
    } catch (error) {
      return error.msg;
    }
  }

  getIndex(fileName) {

  }

  createIndex(fileName) {

  }

  searchIndex(sTerms) {

  }
We can create a new instance of InvertedIndex by calling the constructor thus:

const invertedIndex = new Index();

invertedIndex.validateFile('test.json');

invertedIndex.displayInTableFormat();
MVC

MVC is an achitectural pattern that is used to separate an application's concerns. That is, application code is broken into three layers:

Model - represents an object carrying data. e.g. InvertedIndex Class
View - represents the front end view of the data that model contains. e.g. index.html
Controller - acts on both model and view. It controls the data flow into model object and updates the view whenever data changes. e.g. app.js
Hence as explained above, in the case of the Inverted Index App, the model is the InvertedIndex Class, the view is the front end HTML and CSS, while the controller is the angular app.


## Author
### Omokaro Faith