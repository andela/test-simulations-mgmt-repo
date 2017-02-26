
/**
* function/eventhandler to create a valid json file for user
* @param {} none
* @returns {} none
*/
function createBook() {
  const name = document.getElementById('bookName').value;
  const title = document.getElementById('bookTitle').value;
  const text = document.getElementById('bookText').value;
  document.getElementById('indexMsg').innerHTML = '';
  if (name && title && text) {
    const validText = text.split('');
    if (validText.length < 20) {
      document.getElementById('indexMsg').innerHTML = `Words
       in Text Less than 20`;
    } else {
      const file = `[ { "title": "${title}", "text": "${text}" } ]`;
      const data = `text/json;charset=utf-8, ${encodeURIComponent(file)}`;
      const link = document.getElementById('link');
      link.href = `data:${data}`;
      link.download = `${name}.json`;
      link.innerHTML = `download ${link.download}`;
      link.style.display = 'block';
    }
  } else {
    document.getElementById('indexMsg').innerHTML = `Book not
     created! Enter Book Info!`;
  }
}

/**
* function to switch between divs
* @param {any} target - div to be displayed
* @returns {} none
*/
function switchDiv(target) {
  document.getElementById(target).style.display = 'block';
  for (let i = 1; i < arguments.length; i++) {
    document.getElementById(arguments[i]).style.display = 'none';
  }
}

/**
 *  helper to change multiple divs
 *  @param {} none
 * @returns {} none
 */
function showLibrary() {
  switchDiv('upload-div', 'search-div');
  switchDiv('mainIndex-table', 'index-table');
}

