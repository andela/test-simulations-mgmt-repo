class Index {
  constructor() {
    this.index = {};
    this.temp_search = [];
    this.searchResult = {};
    this.allIndex = {};
  }

  tokenize(words) {
    const token = words.replace(/,+/g, ' ')
    .replace(/[^a-zA-Z 0-9\s]+/g, '')
    .replace(/\s\s/g, ' ')
    .toLowerCase()
    .trim();
    return token;
  }

  distinctWords(words) {
    const token = this.tokenize(words);
    return token.filter((item, index) =>
        token.indexOf(item) === index);
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
      check = {
        status: false,
        msg: 'Invalid File',
      };
    }
    if (check.status === false) {
      throw new Error(check.msg);
    }
  }

  createIndex(fileName, jsonObject) {
    const newIndex = {};

    this.validateFile(jsonObject);

    jsonObject.forEach((object, position) => {
      const longSentence = `${object.title} ${object.text}`;
      const tokenized = this.tokenize(longSentence);
      const wordArray = tokenized.split(' ');

      wordArray.forEach((word, pos) => {
        if (newIndex[word] === undefined) {
          newIndex[word] = [position];
        } else if (newIndex[word].indexOf(position) < 0) {
          newIndex[word].push(position);
        }
      });
    });
    this.index[fileName] = newIndex;
  }

  getIndex(fileName) {
    if (Object.keys(arguments).length < 1) {
      return this.index;
    }

    return this.index[fileName];
  }
  flattenSearch() {
    this.temp_search = [];
    for (const arg of arguments) {
      if (arg instanceof Object && typeof arg !== 'string') {
        for (const item in arg) {
          if (arg.hasOwnProperty(item)) {
            this.flattenSearch(arg[item]);
          }
        }
      } else {
        const args = arg.split(' ');
        args.forEach((word) => {
          this.temp_search.push(word);
        });
      }
    }
  }

  searchIndex(sTerms, fileName) {
    const searchResult = {};
    const allIndex = {};
    if (fileName !== 'Select file') {
      const selectedIndex = this.index[fileName];
      let terms = this.tokenize(sTerms);
      this.flattenSearch(terms);
      terms = this.temp_search;
      terms.forEach((term) => {
        if (selectedIndex) {
          Object.keys(selectedIndex).forEach((savedWord) => {
            if (savedWord === term) {
              searchResult[savedWord] = selectedIndex[savedWord];
            }
          });
        }
      });
      return searchResult;
    } else {
      Object.keys(this.index).forEach((filename) => {
        const selectedIndex = this.index[filename];
        let terms = this.tokenize(sTerms);
        this.flattenSearch(terms);
        terms = this.temp_search;
        terms.forEach((term) => {
          if (selectedIndex) {
            Object.keys(selectedIndex).forEach((savedWord) => {
              if (savedWord === term) {
                searchResult[savedWord] = selectedIndex[savedWord];
              }
            });
          }
        });
        allIndex[filename] = searchResult;
      });
      return allIndex;
    }
  }
}

module.exports = Index;
