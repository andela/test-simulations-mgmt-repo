/**
 * InvertedIndex Class
 *
 * @class
 */
class InvertedIndex {

    /**
     * Constructor initializes indices to an empty object and keeps track of
     * indexed files
     * @constructor
     */
    constructor() {
        this.indexedFiles = {};
    }

    /**
     * removes special characters, white spaces and duplicates
     * @function
     * @param {string} text document title and text
     * @return {Array} tokens
     */
    tokenize(text) {
        const uniqueWords = [];
        const token = text.toLowerCase().replace(/[^\w\s]/gi, '').match(/\w+/g);
        token.forEach((item) => {
            if (!uniqueWords.includes(item)) {
                uniqueWords.push(item);
            }
        });
        return uniqueWords;
    }

    /**
     * create index
     * @function
     * @param {array} jsonArray objects in an Array
     * @param {title} fileName file title
     * @return {Object} index object
     */
    createIndex(jsonArray, fileName) {
        this.fileMap = {};
        jsonArray.forEach((jsonObject, index) => {
            const tokens = this.tokenize(`${jsonObject.title} ${jsonObject.text}`);
            tokens.forEach((token) => {
                if (token in this.fileMap) {
                    this.fileMap[token].push(index);
                } else {
                    this.fileMap[token] = [];
                    this.fileMap[token].push(index);
                }
            });
            this.indexedFiles[fileName] = this.fileMap;
        });
        return this.indexedFiles;
    }

    /**
     * Get Index
     *
     * getIndex method takes a file name and returns the value of the key in the
     * indexedFiles object that matches the file name
     *
     * @param {string} fileName
     * @returns {Object} Object containing file indices
     */
    getIndex(fileName) {
        return this.indexedFiles[fileName];
    }

    /**
     * searches for query in a particular file or all files
     * @param {string} query to search for
     * @param {string} fileName to file to search
     * @returns {Object} returns an object that contains the index of the files
     */
    searchIndex(query, fileName = 'all') {
        const result = {};
        fileName = (fileName !== 'all') ? [fileName] : Object.keys(this.indexedFiles);
        const searchWords = this.tokenize(query);
        fileName.forEach((file) => {
            result[file] = {};
            const fileIndex = this.indexedFiles[file];
            searchWords.forEach((word) => {
                const indexedWords = Object.keys(fileIndex);
                if (indexedWords.includes(word)) {
                    result[file][word] = fileIndex[word];
                } else {
                    result[file][word] = [];
                }
            });
        });
        return result;
    }

    /**
     * Validate file
     * @param {object} fileObject to validate
     * @returns {string} validation message
     */
    validateFile(fileObject) {
        let result = 'Valid file';
        try {
            if (typeof fileObject !== 'object' || Object.keys(fileObject).length === 0) {
                result = 'Empty file';
            }
            fileObject.forEach((key) => {
                if (typeof key.title !== 'string' || typeof key.text !== 'string') {
                    result = 'Invalid file content';
                }
            });
        } catch (error) {
            result = 'Invalid file';
        }
        return result;
    }

}
