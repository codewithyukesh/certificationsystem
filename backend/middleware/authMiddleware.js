const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my_jwt_secret_key'; // Use environment variables in production

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Expecting 'Bearer <token>'
  
  if (!authHeader) return res.status(401).json({ message: 'Access denied, no token provided' });

  const token = authHeader.split(' ')[1]; // Extract token
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add decoded user info to request object
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
