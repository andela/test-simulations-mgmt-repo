/**
* helper object for InvertedIndex class
* @object
*/
const helpers = {
  /** validates file input types
   *
   * @param  {object} file - file to validate
   * @return {boolean} - returns true if valid or false if invalid
   */
  fileIsValid(file) {
    if (!file.name.toLowerCase().match(/\.json$/)) {
      return false;
    }
    return true;
  },

  /** validates content of uploaded file
   *
   * @param  {array} file - file to validate content
   * @return {boolean} returns true if valid or false if invalid
   */
  validFileContent: (file) => {
    let result = true;
    if (!(file instanceof Array)) {
      return false;
    }
    file.forEach((doc) => {
      if ((!doc.title) || (!doc.text)) {
        result = false;
      }
    });
    return result;
  },

  /** removes duplicates from sorted file documents
   * and extract unique words token
   *
   * @param  {Array} filteredContent - Array of filtered book documents
   * @return {Array} tokens - Array of unique words.
   */
  getToken: (filteredContent) => {
    const freshArray = helpers.mergeDocuments(filteredContent);
    const tokens = helpers.removeDuplicates(freshArray);
    return tokens;
  },

  /** remove repeated words from each documents in file
   *
   * @param  {Array} filteredDocs - Array of filtered documents
   * @return {boolean} - true or false
   */
  removeDocDuplicates: (filteredDocs) => {
    const filteredContents = [];
    filteredDocs.forEach((doc) => {
      filteredContents.push(helpers.removeDuplicates(doc));
    });
    return filteredContents;
  },

  /** removes repeated words from an array
   *
   * @param  {object} doc - document to remove duplicates from
   * @return {array} newlist - array of filtered contents
   */
  removeDuplicates: (doc) => {
    const newList = doc.filter((word, index) =>
      doc.indexOf(word) === index);
    return newList;
  },

  /** applies the filterContent function on all
   * the documents in the selectedBook
   *
   * @param  {Array} file - an array of books with title and text
   * @return {Array} filteredBook - Array of filtered book contents
   */
  filterFileContent: (file) => {
    const filteredDocs = [];
    file.forEach((content) => {
      filteredDocs.push(helpers.filterContent(content.title,
        content.text));
    });
    const filteredBook = helpers.removeDocDuplicates(filteredDocs);
    return filteredBook;
  },

  /** filters and return an array of filtered
   *  string with special characters removed
   *
   * @param  {String} title -title of book
   * @param  {String} text - text in book
   * @return {Array} words - Array of filtered book content
   */
  filterContent: (title, text) => {
    text = text || '';
    let words = (`${title} ${text}`)
      .replace(/[^a-zA-Z ]/g, '')
      .toLowerCase()
      .split(' ');
    words = words.filter(word => /\S/.test(word));
    return words;
  },

  /** combines all the documents in a book
   * and returns an Array of sorted strings
   *
   * @param  {Array} filteredContents - Array of filtered book documents
   * @return {Array} sortedArrays - Array of comebined
   * and sorted filtered book content
   */
  mergeDocuments: (filteredContents) => {
    let allStr = '';
    filteredContents.forEach((z) => {
      allStr += `${z.join(' ')} `;
    });
    const sorted = allStr.trim().split(' ').sort();
    return sorted;
  },
};
