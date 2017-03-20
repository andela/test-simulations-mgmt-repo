#### Output
- **Using**: Github
- **Deliverable**: A Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...)


#### Deliverable

##### DESIGN PATTERN USED
 
###### MVC Pattern

MVC Pattern stands for Model-View-Controller Pattern. This pattern is used to separate application's concerns.

* Model - represents an object carrying data
* View - represents the visualization of the data the model contains.
* Controller - acts on both model and view. It controls the data flow into model object and updates the view whenever data changes and also acts as an intemidiary between view and model effectively separating them.
 
In the case of the Inverted Index App:
The model is the - `InvertedIndex Class`, 
The view is the front end (HTML and CSS),
The controller is the angular  

###### THE CONSTRUCTOR PATTERN 
 
Constructors are used to create specific types of objects - both preparing the object for use and accepting arguments which a constructor can use to set the values of member properties and methods when the object is first created.
The `InvertedIndex` class makes use of the Constructor pattern.

```
 
 class InvertedIndex {
 
   constructor() {
     this.index = {};
   }

   createIndex(fileName, fileContent) {
   }
   
   storeIndex(fileName, completeIndex) {
   }
   
   getIndex(fileName) {
   }
   
   searchIndex(fileName, term) {
   }

}
 
 ```
 
To use the methods of the object you first have to create an instance of the class: 
 
`invertedIndex = new InvertedIndex()`