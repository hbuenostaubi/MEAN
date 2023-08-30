const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // get the space after 'Bearer #@!#GADD' string
    jwt.verify(token, 'secret_this__should_be_longer')
    next();
  } catch (error) {
    res.status(401).json({success: false, message: 'auth failed'})
  }
};
