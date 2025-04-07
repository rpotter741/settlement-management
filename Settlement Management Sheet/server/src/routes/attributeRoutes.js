import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.js';

import {
  saveAttribute,
  getCommunityAttributes,
  getUserAttributes,
  getAttributeById,
  publishAttribute,
} from '../controllers/attributeController.js';

const router = express.Router(); // Create a new router instance

router.get('/personal', getUserAttributes);

router.get('/community', getCommunityAttributes);

router.get('/:id', getAttributeById);

router.post('/save', saveAttribute);

router.post('/publish', publishAttribute);

export default router;
