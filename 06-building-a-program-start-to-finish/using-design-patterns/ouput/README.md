## Output

## Design Patterns Used:
1. Module Pattern: A module is a component of source code that accomplishes a particular function or contain everything necessary to perform a particular task. The source code for the Inverted Index app is broken into modules such as the `InvetedIndex.js` file (the implementation for the inverted index functionality) and `app.js` which contains the controller for the view.

```
(() => {
  angular.module('invertedIndex', ['angular-typed']).controller('InvertedController', ($scope) => {
    ...
  });
```

```
class InvertedIndex {
  ...
}
```

2. Asynchronous Pattern: The asynchronous design pattern is a design pattern in which the call site is not blocked while waiting for the code call to finish. This means that, once a block of code is called, execution immediately goes to the next line even if it hasn't returned. Instead the code calling the block is notified when the reply arrives. This design pattern is used in the readFile method of the Inverted Index class. The file reading is asynchronous, which means that other code blocks don't have to wait for the entirety of the file reading process.

```
readFile(file, fileName) {
    this.file = file;
    const validJson = /.+\.json$/;

    if (!validJson.exec(fileName)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (fileBeingRead) => {
        const fileContent = fileBeingRead.target.result;

        try {
          JSON.parse(fileContent);
        } catch (err) {
          reject('This JSON file is invalid. Check the file and try again.');
        }

        resolve(fileContent);
      };

      fileReader.readAsText(this.file);
    });
  }
```

3. Prototype Pattern: The prototype design pattern is used in the Inverted Index class for its instances. The Inverted Index class has no constructor, which would have specified properties to be assigned to instances directly. The Inverted Index class only consists of methods. These methods are assigned to its prototype and shared by all of its instances.

```
const newIndex = new InvertedIndex();

newIndex.validateFile(testFile)
```
