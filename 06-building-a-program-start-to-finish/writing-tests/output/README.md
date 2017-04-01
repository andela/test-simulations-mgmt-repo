#### Output
- **Using**: Mocha/Jasmine with any assertion library of choice (Chai.JS, Should.JS, Expect.JS...)
- **Deliver**: Your test files for the Inverted Index class and all associated dependencies.
- **With**: *independently*

#### Note
- I added extra configuration for my ESLint as follows:
```
"env": {
    "browser": true
  },
  "globals": {
    "toastr": true,
    "expect": true,
    "InvertedIndex": true
  },
```
I added enviromental variable `browser` so that I can call the `document` object in my code. Eg. `document.getElementById`
Also I added my `toastr` plugin, `InvertedIndex` class and Jasmine `expect` as global variables so that I could use them in my code.