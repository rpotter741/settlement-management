import jwt from 'jsonwebtoken';
import env from '../config/env.js';

function checkRole(requiredRole) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });

    try {
      const user = jwt.verify(token, env.JWT_SECRET);
      if (user.role !== requiredRole) return res.status(403).json({ error: 'Access denied' });
      req.user = user; // Attach user info for downstream use
      next();
    } catch (err) {
      res.status(403).json({ error: 'Invalid token' });
    }
  };
}

export default checkRole;
