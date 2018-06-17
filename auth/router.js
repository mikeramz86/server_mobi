'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var path = require('path');
var appDir = path.dirname(require.main.filename);
const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.EmailAddress,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};


const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json()); 
router.post('/login', localAuth, (req, res) => {
  console.log('hello');
   	const authToken = createAuthToken(req.user.serialize());
   	// const jwtAuth = passport.authenticate('jwt', { session: false });
   	res.json({authToken});
   	
});

const jwtAuth = passport.authenticate('jwt', {session: false});
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};