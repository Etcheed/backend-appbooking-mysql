const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.jwt.secret);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};