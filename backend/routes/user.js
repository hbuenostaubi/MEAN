const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
          email: req.body.email,
          // npm i --save bcrypt to hash passwords
          password: hash
        });
        user.save()
          .then(result => {
            res.status(201).json({
              message: 'user created', result: result, success: true
            });
          })
          .catch(err => {
            res.status(500).json({
              message: 'failure adding user', error: err, success: false
            });
          });
      }
    );
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'no user found', success: false
        });
      }
      fetchedUser = user;
      return bcrypt.compare(fetchedUser.password, fetchedUser.password);
    }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Incorrect password.', success: false
      });
    }
    // npm i --save jsonwebtoken for token pkgs
    const token = jwt.sign({email: user.email, userId: user._id}, 'secret_this_should_be_longer', {expiresIn: '1h'});

    res.status(200).json({
      token: token,
      expiresIn: 3600  // will expire in 3600 (1h) seconds and will get used in the front end
    });
  })
    .catch(error => {
      return res.status(401).json({
        message: 'Error Checking Password', success: false
      });
    });
});
module.exports = router;
