/**
 * Sort an object alphabetically
 * @param {any} data
 * @returns sorted object
 */
function sort(data) {
  const sorted = {};
  Object.keys(data).sort().forEach((key) => {
    sorted[key] = data[key];
  });
  return sorted;
}

/**
 * Fetch all the title from a file
 * @param {any} data
 * @returns an array if data
 */
function fetchTitle(data) {
  const title = data.map(item => item.title);
  return title;
}

/**
 * Check if an item is found in an array
 * @param {any} titles
 * @param {any} list
 * @returns boolean
 */
function isFound(titles, list) {
  return list.indexOf(titles) !== -1;
}

