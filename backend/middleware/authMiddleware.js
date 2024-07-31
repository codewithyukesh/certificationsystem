const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my_jwt_secret_key'; // Ensure this matches with the one in auth.js

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access denied, no token provided' });

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
