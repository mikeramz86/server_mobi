const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const { CLIENT_ORIGIN } = require('./config');
const { DATABASE_URL, PORT } = require('./config');






var path = require('path');
var logger = require('morgan');
const jobs = require('./routes/jobs');
const users = require('./routes/users')
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

app.use(morgan('common'));




app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
  next()
})

app.use(express.static('public'));
app.use('/jobs', jobs);
app.use('/users', users);
app.use('/auth', authRouter);






app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}
// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}
module.exports = { app, runServer, closeServer };