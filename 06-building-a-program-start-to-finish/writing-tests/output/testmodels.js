class FakeInvertedIndex {

}

const model = {

  orderedObject: {
    a: '',
    alice: '',
    alliance: '',
    dork: '',
    fate: '',
    lord: '',
    zoe: ''
  },

  unorderedObject: {
    alliance: '',
    zoe: '',
    dork: '',
    lord: '',
    a: '',
    fate: '',
    alice: ''
  },

  validJsonTestData: [
    [{
      title: 'A good bot',
      text: 'Give a good bot a penny a day'
    },
    {
      title: 'A bad bot',
      text: 'Give a bad bot a knock on the head'
    }],
    [{
      title: 'Gone With The Wind',
      text: 'After all, tomorrow is another day.'
    },
    {
      title: 'Crime and Punishment',
      text: 'When reason fails, the devil helps.'
    }]
  ],

  index: {
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
    head: ['A bad bot']
  },

  indices: {
    book1: {
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
      head: ['A bad bot']
    }
  },

  FakeInvertedIndex,

  invalidData: [
    [
      {
        name: 'Alice',
        fame: 'Alice falls into a rabbit hole and enters a world full of imagination.'
      },
      {
        name: 'The Lord',
        fame: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
      }
    ],
    [
      {
        title: 'A good bot',
        tex: 'Give a good bot a penny a day'
      }
    ]
  ],

  searchResults: [
    {
      bad: ['A bad bot'],
      bot: ['A good bot', 'A bad bot'],
      knock: ['A bad bot'],
      good: ['A good bot']
    },
    {
      a: ['A good bot', 'A bad bot'],
      really: [null],
      good: ['A good bot'],
      knock: ['A bad bot'],
      for: [null],
      the: ['A bad bot'],
      bot: ['A good bot', 'A bad bot']
    },
    null,
    {
      book1: null,
      book2: null
    },
    {
      book1: {
        tomorrow: [null],
        helps: [null],
        devil: [null],
        a: ['A good bot', 'A bad bot'],
        the: ['A bad bot'],
        give: ['A good bot', 'A bad bot'],
        bot: ['A good bot', 'A bad bot'],
        knock: ['A bad bot']
      },
      book2: {
        a: [null],
        give: [null],
        bot: [null],
        knock: [null],
        tomorrow: ['Gone With The Wind'],
        helps: ['Crime and Punishment'],
        the: ['Crime and Punishment'],
        devil: ['Crime and Punishment'],
      }
    },
    {
      a: [null],
      he: [null],
      look: [null],
      said: [null]
    }
  ]
};

module.exports = model;
