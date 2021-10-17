const Fuse = require('fuse.js')

const options = {
  includeScore: true,
  keys: [
    "name",
  ]
};

const data = [
  {
    name: "Kolmá",
    name: "Kolmáro",
    name: "Heythere",
    name: "randomstring",
  }
]

const fuse = new Fuse(data, options)

console.log(fuse.search('randomstring'))