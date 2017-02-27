const data = [
  {
    title: 'A good bot',
    text: 'Give a good bot a penny a day'
  },
  {
    title: 'A bad bot',
    text: 'Give a bad bot a knock on the head'
  }
];

const index = {
  give: ['A good bot', 'A bad bot'],
  a: ['A good bot', 'A bad bot'],
  good: ['A good bot'],
  bot: ['A good bot', 'A bad bot'],
  penny: ['A good bot'],
  day: ['A good bot'],
  bad: ['A bad bot'],
  knock: ['A bad bot'],
  on: ['A bad bot'],
  the: ['A bad bot'],
  head: ['A bad bot'] };

const fake_data = [
  {
    title: 'A good bot',
    tex: 'Give a good bot a penny a day'
  }
];

const search_all = {
  file1: {
    good: ['A good bot'],
    knock: ['A bad bot'],
    penny: ['A good bot']
  },
  file2: {
    good: ['A good bot'],
    knock: ['A bad bot'],
    penny: ['A good bot']
  }
};

class FakeInvertedIndex {

}

const f = [
  {
    name: 'Alice',
    fame: 'Alice falls into a rabbit hole and enters a world full of imagination.'
  },
  {
    name: 'The Lord',
    fame: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
  }
];

const searchQueries = ['bad good bot knock'];
const searchResults = [
  {
    bad: ['A bad bot'],
    bot: ['A good bot', 'A bad bot'],
    knock: ['A bad bot'],
    good: ['A good bot']
  }
];
