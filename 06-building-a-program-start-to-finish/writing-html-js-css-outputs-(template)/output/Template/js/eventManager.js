window.onload = function() {
  const invertedObj = new InvertedIndex();
  const fileInput = document.getElementById('file');
  const wrongFiles = [];
  const wrnMessage = '  Invalid file upload';
  const files = [];
  const input = $('#file');
  const allFilesTile = invertedObj.allFilesTitle;

  /**
   * File reader function
   * @param {object} file passed in by the Validate function
   * @param {object} arg object passed
   * @returns {Boolean} return true or false for file structure
   */
  const jsonFileReader = (file, arg) => {
    let object = [];
    let object1 = [];
    try {
      let reader = new FileReader();
      reader.onload = (e) => {
        object = JSON.parse(e.target.result);
        document.getElementById('user-message1').innerHTML = '';
        document.getElementById('user-message').innerHTML = '';
        if (object[0].title === undefined) {
          document.getElementById('user-message').innerHTML = 'Invalid Json file format';
          return false;
        }
        if (object[0].title !== undefined) {
          document.getElementById('user-message1').innerHTML = 'File Upload was successful';
          arg.createIndex(object, file.name);
          populateDropDown(file.name);
          return true;
          return arg.index;
        }
      }
      reader.readAsText(file);
    } catch (error) {
      return false;
      document.getElementById('user-message').innerHTML = 'Invalid Json file format';
    }
  };

  $('#upload-btn').click(() => {
      Object.keys(fileInput.files).forEach((file) => {
        if(fileInput.files[file].type === 'application/json' && fileInput.files[file].size < 1) {
          wrongFiles.push(fileInput.files.name);
          document.getElementById('user-message').innerHTML
          = wrongFiles + wrnMessage;
        } if (fileInput.files[file].type === 'application/json') {
          files.push(fileInput.files[file]);
          jsonFileReader(fileInput.files[0], invertedObj);
        } else if (fileInput.files[file].name !== 'application/json') {
          wrongFiles.push(fileInput.files.name);
          document.getElementById('user-message').innerHTML
          = wrongFiles + wrnMessage;
        }
      });
    input.replaceWith(input.val(''));
  });
  
  $('#btn-create').on('click', () => {
    deleteTable();
    const bookName = $('#sFile').val();
    document.getElementById('user-message').innerHTML = '';
    document.getElementById('user-message1').innerHTML = '';
    let viewIndexFiles = invertedObj.allFiles;
    let viewIndexLength = invertedObj.allLength;
    if (bookName === 'All') {
      document.getElementById('user-message').innerHTML = 'No book selected';
    } else {
      populateTable(viewIndexFiles[bookName],
      bookName, viewIndexLength[bookName], allFilesTile);
    }
  }); 

  $('#btn-search').click(() => {
    deleteTable();
    document.getElementById('user-message').innerHTML = '';
    document.getElementById('user-message1').innerHTML = '';
    const searchstring  = $('#search').val();
    const filterName = $('#sFile').val();
    const wordArray = searchstring.toLowerCase().match(/\w+/g);
    const viewIndexLength = invertedObj.allLength;
    const searchResult = invertedObj.searchFiles(wordArray, filterName);
    if (!searchstring) {
      document.getElementById('user-message').innerHTML = 'Type in a search';
    } else if (filterName === 'All') {
      Object.keys(searchResult).forEach((keys) => {
        populateTable(searchResult[keys],
        keys, viewIndexLength[keys], allFilesTile);
      });
    } else if (filterName !== 'All') {
      populateTable(searchResult[filterName],
      filterName, viewIndexLength[filterName], allFilesTile);
    }
  });
  /**
   * function
   * @param {object} object 
   * @return {any} populate page with data
   */
  const populateTable = (object, fileName, columnLength, allFilesTitle) => {
    
    let indexDiv = '<br><br><br><div class = "indexDiv"><h2 id = "titleHeader">' +
    fileName + '</h2>';
    indexDiv += '<table class = "responstable">';
    for(let headloop = 0; headloop <= columnLength; headloop += 1) {
      if(headloop === 0) {
        indexDiv += '<thead><tr><th>Terms</th>';
      } else {
        indexDiv += '<th>' + allFilesTitle[headloop - 1] + '</th>';
      }
    }
    indexDiv += '</tr></thead>';
    indexDiv += '<tbody>';
    for (let term in object) {
      indexDiv += '<tr><td>' + term + '</td>';
      for (let column = 0; column < columnLength; column++) {
        if (object[term][column]) {
          indexDiv += '<td> <i class = "fa fa-check"' + 'style = "font-size:15px"></i> </td>';
        } else {
          indexDiv += '<td> <i class = "fa fa-times-circle-o"' +
            'aria-hidden = "true"></i></td>';
        }
      }
    }
    indexDiv += '</tr>';
    indexDiv += '</tbody></table>';
    $('.display').append(indexDiv);    
  }
  /**
   * function
   */
  const deleteTable = () => {
      $("#table-holder").remove();
      $('figure').append('<div class="display table well" id="table-holder"></div>');
  }

  const populateDropDown = (fileName) => {
    let object = fileName;
    $('<option/>').val(object).html(object).appendTo('#sFile');
  }
};
