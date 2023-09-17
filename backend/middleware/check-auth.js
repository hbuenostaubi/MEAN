const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // get the space after 'Bearer #@!#GADD' string
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next(); // will move on the the next middleware and keep any fields added to it
  } catch (error) {
    res.status(401).json({success: false, message: 'You are not authenticated'});
  }
};
