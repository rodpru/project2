const mongoose = require('mongoose');
const NeedType = require('../models/NeedType.js');


mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const needs = [
  {name: 'food',
  color: 'turchese',
  },
  {name: 'hosting',
  color: 'blue',
  },
  {name: 'administrative',
  color: 'peach',
  },
  {name: 'healthcare',
  color: 'navy',
  }
];



// Then we create the types.
NeedType.create(needs)
  .then(needsFromSeed=> {
    console.log(`Created ${needsFromSeed.length} needs`);
    mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating need types from the DB: ${err}`));