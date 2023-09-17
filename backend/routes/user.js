const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const UserController = require('../controllers/user')

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;
