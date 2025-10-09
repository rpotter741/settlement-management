import express from 'express';
import {
  registerUser,
  loginUser,
  signoutUser,
  updateUserSettings,
  invitePlayer,
  joinGame,
} from '../controllers/userController.ts';
import { verifyAuth } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Authenticated routes
router.post('/signout', verifyAuth, signoutUser);
router.put('/update-settings', verifyAuth, updateUserSettings);
router.post('/invite-player', verifyAuth, invitePlayer);
router.post('/join-game', verifyAuth, joinGame);

export default router;
