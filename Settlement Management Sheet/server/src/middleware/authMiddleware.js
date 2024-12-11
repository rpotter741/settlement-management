import jwt from 'jsonwebtoken';

export const verifyAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    // Skip authentication in development
    req.user = { id: 'dev-user', role: 'admin' }; // Mock user object
    return next();
  }
  // Get token from the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next(); // Pass control to the next middleware/route handler
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};
