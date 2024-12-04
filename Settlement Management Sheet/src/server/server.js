import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from './config/env.js';

import User from './models/User.js';
import Settlement from './models/Settlement.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON payloads

const PORT = env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//basic routes for now

const users = [];

// Register
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword, role };
  users.push(user); // Save to database later

  res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected Route
app.get('/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const user = jwt.verify(token, env.JWT_SECRET);
    res.json({ message: 'Access granted', user });
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

// social routes
app.post('/settlement/:settlementId/invite', (req, res) => {
  const { role } = req.body; // e.g., 'player', 'citizen'
  const { settlementId } = req.params;

  const token = jwt.sign({ settlementId, role }, env.JWT_SECRET, { expiresIn: '7d' });

  const inviteLink = `${env.FRONTEND_URL}/join?token=${token}`;
  res.json({ inviteLink });
});

app.post('/join', async (req, res) => {
  const { token } = req.body;
  try {
    const { settlementId, role } = jwt.verify(token, env.JWT_SECRET);
    const userId = req.user._id; // Assume user is authenticated

    // Add user to the settlement
    const settlement = await Settlement.findById(settlementId);
    settlement.users.push({ userId, role });
    await settlement.save();

    // Add settlement to the user's profile
    const user = await User.findById(userId);
    user.settlements.push({ settlementId, role });
    await user.save();

    res.json({ message: 'Successfully joined the settlement!' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired invite link' });
  }
});

// custom components controller
app.post('/settlement/:id/custom-category', async (req, res) => {
  const { name, subComponents, settings } = req.body;
  const settlement = await Settlement.findById(req.params.id);

  // Ensure the category name is unique
  if (settlement.customCategories.some((cat) => cat.name === name)) {
    return res.status(400).json({ error: 'Category name must be unique.' });
  }

  settlement.customCategories.push({ name, subComponents, settings });
  await settlement.save();
  res.json({ message: 'Custom category added successfully.' });
});

