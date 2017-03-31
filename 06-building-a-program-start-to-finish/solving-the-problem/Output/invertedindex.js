class InvertedIndex {

  constructor(){
    this.indexed = {};
  }

  getIndex(fileName) {
      return this.indexed[fileName];
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileToValidate = JSON.parse(reader.result);
            let response = this.validateFile(fileToValidate);
            resolve(response);
        }
        reader.readAsText(file)
      }
      catch(error) {
        reject(error);
      }
    });
  }

  validateFile(fileToValidate) {
    const fileLength = fileToValidate.length;
    for(let key = 0; key < fileLength; key += 1) {
      if (typeof fileToValidate !== 'object'
          || Object.keys(fileToValidate[key]).length !== 2
          || fileToValidate[key].title === undefined
          || fileToValidate[key].text === undefined
          || typeof fileToValidate[key].title !== 'string'
          || typeof fileToValidate[key].text !== 'string') {
            return {
              success: false,
              message: 'has an invalid JSON format.'
            };
      } else {
          return {
            success: true,
            message: 'File is valid',
            fileToValidate
          };
      }
    }
  }

  tokenize(words) {
    const pattern = /[ .:;?!~,`'&|()<>{}[\]\r\n/\\]+/;
    return words.toLowerCase().split(pattern);
  }

  createIndex(fileName, book) {
    let indices = {};
    book.forEach((book, index) => {
      let words = "";
      words = (`${book.title} ${book.text}`);
      words = this.tokenize(words);
      words.forEach((word) => {
        if (indices[word]) {
          if (indices[word].indexOf(index) == -1) {
            indices[word].push(index);
          }
        } else {
          indices[word] = [index];
        }
      });
    });
    this.indexed[fileName] = {
      eachWord: indices,
      numOfDocs: book.length
    };
  }

  searchIndex(phrase) {
    const result = {};
    for (const filename of Object.keys(this.indexed)) {
      const stored = this.getIndex(filename);
      const mySearch = this.tokenize(phrase);
      const search = {
      eachWord: {},
      numOfDocs: stored.numOfDocs
       };
    mySearch.forEach((word) => {
      if (stored.eachWord[word]) {
        search.eachWord[word] = stored.eachWord[word];
      }
      else search.eachWord[word] = [];
    });
    result[filename] = search;
  } 
  return result; 
  }
}
