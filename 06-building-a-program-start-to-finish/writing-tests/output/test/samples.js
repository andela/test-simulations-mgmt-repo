module.exports = {
  invalidBooks: [
    {
      titl: 'Alice in Wonderland',
      text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring.',
      txt: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
    },
    {
      name: 'The Lord of the Rings: The Fellowship of the Ring.',
      data: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
    }
  ],
  validBooks: [
    {
      title: 'Mort',
      text: 'Death comes to us all. When he came to Mort, he offered him a job.'
    },
    {
      title: 'Reaper Man',
      text: 'Death is missing – presumed ... er ... gone. Which leads to the kind of chaos to always expect when an important public service is withdrawn.'
    },
    {
      title: 'Soul Music',
      text: "Other children got given xylophones. Susan just had to ask her grandfather to take his vest off.\nYes. There's a Death in the family."
    },
    {
      title: 'Hogfather',
      text: "It's the night before Hogswatch. And it's too quiet."
    },
    {
      title: 'Hogfather',
      text: "It's the night before Hogswatch. And it's too quiet."
    }
  ],
  tokens: ['death', 'comes', 'to', 'us', 'all', 'when', 'he', 'came', 'mort', 'offered', 'him', 'a', 'job'],
  titles: ['Mort', 'Reaper Man', 'Soul Music', 'Hogfather', 'Hogfather (1)'],
  index: {
    mort: ['Mort'],
    death: ['Mort', 'Reaper Man', 'Soul Music'],
    comes: ['Mort'],
    to: ['Mort', 'Reaper Man', 'Soul Music'],
    us: ['Mort'],
    all: ['Mort'],
    when: ['Mort', 'Reaper Man'],
    he: ['Mort'],
    came: ['Mort'],
    offered: ['Mort'],
    him: ['Mort'],
    a: ['Mort', 'Soul Music'],
    job: ['Mort'],
    reaper: ['Reaper Man'],
    man: ['Reaper Man'],
    is: ['Reaper Man'],
    missing: ['Reaper Man'],
    presumed: ['Reaper Man'],
    er: ['Reaper Man'],
    gone: ['Reaper Man'],
    which: ['Reaper Man'],
    leads: ['Reaper Man'],
    the: ['Reaper Man', 'Soul Music', 'Hogfather', 'Hogfather (1)'],
    kind: ['Reaper Man'],
    of: ['Reaper Man'],
    chaos: ['Reaper Man'],
    always: ['Reaper Man'],
    expect: ['Reaper Man'],
    an: ['Reaper Man'],
    important: ['Reaper Man'],
    public: ['Reaper Man'],
    service: ['Reaper Man'],
    withdrawn: ['Reaper Man'],
    soul: ['Soul Music'],
    music: ['Soul Music'],
    other: ['Soul Music'],
    children: ['Soul Music'],
    got: ['Soul Music'],
    given: ['Soul Music'],
    xylophones: ['Soul Music'],
    susan: ['Soul Music'],
    just: ['Soul Music'],
    had: ['Soul Music'],
    ask: ['Soul Music'],
    her: ['Soul Music'],
    grandfather: ['Soul Music'],
    take: ['Soul Music'],
    his: ['Soul Music'],
    vest: ['Soul Music'],
    off: ['Soul Music'],
    yes: ['Soul Music'],
    theres: ['Soul Music'],
    in: ['Soul Music'],
    family: ['Soul Music'],
    hogfather: ['Hogfather', 'Hogfather (1)'],
    its: ['Hogfather', 'Hogfather (1)'],
    night: ['Hogfather', 'Hogfather (1)'],
    before: ['Hogfather', 'Hogfather (1)'],
    hogswatch: ['Hogfather', 'Hogfather (1)'],
    and: ['Hogfather', 'Hogfather (1)'],
    too: ['Hogfather', 'Hogfather (1)'],
    quiet: ['Hogfather', 'Hogfather (1)']
  },
  extraBooks: [
    {
      title: 'Alphabet',
      text: 'The quick brown fox jumps over the lazy dog.'
    },
    {
      title: 'More Alphabet',
      text: 'The Quick brown fox jumped over the lazy dogs.'
    }
  ],
  extraTitles: ['Alphabet', 'More Alphabet'],
  extraIndex: {
    alphabet: ['Alphabet', 'More Alphabet'],
    the: ['Alphabet', 'More Alphabet'],
    quick: ['Alphabet', 'More Alphabet'],
    brown: ['Alphabet', 'More Alphabet'],
    fox: ['Alphabet', 'More Alphabet'],
    jumps: ['Alphabet'],
    over: ['Alphabet', 'More Alphabet'],
    lazy: ['Alphabet', 'More Alphabet'],
    dog: ['Alphabet'],
    more: ['More Alphabet'],
    jumped: ['More Alphabet'],
    dogs: ['More Alphabet']
  },
  searchResults: {
    'extraBooks.json': {
      comes: [],
      death: [],
      extravaganza: [],
      he: [],
      the: ['Alphabet', 'More Alphabet']
    },
    'validBooks.json': {
      comes: ['Mort'],
      death: ['Mort', 'Reaper Man', 'Soul Music'],
      extravaganza: [],
      he: ['Mort'],
      the: ['Reaper Man', 'Soul Music', 'Hogfather', 'Hogfather (1)']
    }
  }
};
