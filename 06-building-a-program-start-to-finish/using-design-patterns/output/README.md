#### Design Patterns Used

**_Contructor Pattern_**

A constructor is a special method used to initialize a newly created object once memory has
been allocated for it. In constructor pattern the object is declared solely by it’s constructor.

The InvertedIndex Class makes use of the constructor design pattern. To create an instance of the class, a constructor function must be called.

```
class InvertedIndex {

  constructor() {
    this.indexedFiles = {};
  }

  createIndex(fileContents, fileName) {

  }

  getIndex(fileName) {

  }

  searchIndex(query, fileName = 'all') {

  }
}
```

And we can create a new instance of InvertedIndex by calling the constructor thus:

```
const invertedIndex = new InvertedIndex();

invertedIndex.createIndex(filedata, 'books.json');

invertedIndex.searchIndex('alice wonderful', 'books.json');
```

**_MVC Pattern_**

* Model - represents an object carrying data
* View - represents the frontend view of the data that model
contains.
* Controller - acts on both model and view. It controls the
data flow into model object and updates the view whenever data
changes.

In the case of the Inverted Index App, the model is the
`InvertedIndex Class`, the view is the front end HTML and CSS,
while the controller is the angular