const { Tweet } = require('./models');
const { User } = require('./models');
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));
app.use(cors());

function createUser(user) {
  User
    .find()
    .then(users => {
      if(users.length < 2) {
        User.create(user)
      }
    })  
}

const KidCudi = {
  name: 'KidCudi',
  location: 'Some Place Higher',
  link: 'some link',
  joined: '10/4/2001',
  status: 'smokin da status'
}

const ChrissyTeigen ={
  name: 'ChrissyT',
  location: 'who is she again',
  link: 'CT.com',
  joined: '11/19/2014',
  status: 'yo kid' 
}

//make two users to play with
createUser(KidCudi);
createUser(ChrissyTeigen);  

//get
app.get('/:name', (req, res) => {
  const name = req.params.name;
  User
    .find({ name: name })
    .then(users => users)
    .then(users => { //I am aware putting the second find() in a then is not optimal for a production app
      Tweet.find({ name: name }).then(tweets => {
        res.json({
          users: users.map((user) => user.serialize()),
          tweets: tweets.map((tweet) => tweet.serialize())
        });
      })
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

//post
app.post('/:name', jsonParser, (req, res) => {
  const requiredFields = ['text', 'name', 'date']
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Tweet
    .create({
      name: req.body.name,
      text: req.body.text,
      date: req.body.date
    })
    .then(tweet => res.status(201).json(tweet.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.delete('/:id', jsonParser, (req, res) => {
  Tweet.findOneAndRemove({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'success' }))
  .catch(err => { 
    console.log(err)
    res.status(500).json({ error: 'something went wrong buddy!' });
  })
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      //{ useNewUrlParser: true },
      { useFindAndModify: false },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

