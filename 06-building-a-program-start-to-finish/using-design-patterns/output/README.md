#### Output
- **Using**: GitHub
- **Deliver**: a Pull Request showing two Design Patterns (suggestions: Decorator, Factory, Observer, Prototype...) or a detailed explanation of Design Patterns used while `solving-the-problem`
- **With**: *independently*

### Patterns

#### Architectural Pattern: MVVM
MVVM, or Model-View-ViewModel, is a software architectural pattern that aims to improve application organization through separation of business logic and data, user interfaces and presentation logic. While the ViewModel is not aware of the View, the View is aware of the Model; many implementations of this pattern include bidirectional data binding between the View and the ViewModel. MVVM is a derivative of the Model-View-Controller pattern.

##### Model
The Model encapsulates the properties and behaviours of the business data of the application, in this case the `InvertedIndex` class. It is completely isolated from the View.

##### View
The View is the user interface of the application. It is linked to the ViewModel via declarative bindings via which it displays up-to-date information from and passes data/commands to the ViewModel. In this project the View consists of HTML templates with AngularJS bindings and directives.

##### ViewModel
The ViewModel contains the logic that connects the View and the Model. It exposes methods for manipulating the Model and managing the state of the View. While the ViewModel is an abstract representation of the View, it is not aware of the View (the View, however, is aware of the ViewModel). The ViewModel of this application is its AngularJS controller functions.

#### Design Patterns

##### Creational Pattern: Constructor Pattern
In object-oriented programming a constructor is a special method used to initialize a newly created object once memory has been allocated for it. The `InvertedIndex` class uses a basic constructor pattern, which:
- does not separate construction and representation
- does not defer instantiation (i.e. specifies the class of object to be created)
- allows for creation of more than one instance of a class
The `InvertedIndex` class can be instantiated by calling the constructor:
```const invertedIndex = new InvertedIndex();```