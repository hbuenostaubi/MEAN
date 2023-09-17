const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email, // npm i --save bcrypt to hash passwords
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created', result: result, success: true
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials', error: err, success: false
          });
        });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'no user found', success: false
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Incorrect password.', success: false
        });
      }
      // npm i --save jsonwebtoken for token pkgs
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        process.env.JWT_KEY,
        {expiresIn: '1h'});

      res.status(200).json({
        token: token, expiresIn: 3600,  // will expire in 3600 (1h) seconds and will get used in the front end
        userId: fetchedUser._id
      });
    })
    .catch(error => {
      return res.status(401).json({
        message: 'Invalid authentication credentials', success: false
      });
    });
}
