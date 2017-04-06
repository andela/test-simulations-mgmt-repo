const allFilesMock = {
  'doc.json': [{ a: [0],
    alice: [0],
    alliance: [1],
    an: [1],
    elf: [1],
    falls: [0],
    hole: [0],
    into: [0],
    man: [1],
    of: [1],
    rabbit: [0],
    unusual: [1] }, ['Alice in Wonderland', 'The Lord of the Rings: The Fellowship of the Ring.']],

  'test.json': [{ alice: [0],
    alliance: [1, 2],
    an: [1, 2],
    and: [0, 1, 2],
    man: [1, 2],
    hole: [0],
    a: [0, 1, 2],
    dwarf: [1, 2],
    falls: [0],
    imagination: [0],
    rabbit: [0],
    unusual: [1, 2],
    wizard: [1, 2] }, ['Alice in Wonderland', 'The Lord of the Rings: The Fellowship of the Ring.', 'The Lord of the Rings.']],
};

const lowerDocFile = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },
];

const testFile = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },
];

const testFile2 = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },

  {
    title: 'The Lord of the Rings.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },
];

const testFile3 = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'Hello, is it me you are looking for?',
  },
];

const  shortFile = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice. falls- into@ a+ rabbit hole.',
  },
];

const shortFile2 = [
  {
    title: 'Alice in Wonderland',
    text: 'Alice. falls- into@ a+ rabbit hole.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf.',
  },
];


const invalidTestFile = [
  {
    name: 'Alice in Wonderland',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.',
  },
];
