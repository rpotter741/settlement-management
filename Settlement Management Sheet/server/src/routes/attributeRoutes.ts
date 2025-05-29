import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.ts';

import {
  saveAttribute,
  getCommunityAttributes,
  getUserAttributes,
  getAttributeById,
  publishAttribute,
} from '../controllers/attributeController.ts';

const router = express.Router(); // Create a new router instance

router.get('/personal', getUserAttributes);

router.get('/community', getCommunityAttributes);

router.get('/:id', getAttributeById);

router.post('/save', saveAttribute);

router.post('/publish', publishAttribute);

export default router;
