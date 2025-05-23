import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import requestLogger from './middleware/requestLogger.js';
import userRouter from './routes/userRoutes.js';
import toolRouter from './routes/toolRoutes.js';
import glossaryRouter from './routes/glossaryRoutes.js';
import prisma from './db/db.js';

dotenv.config();

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(cookieParser()); // Parse cookies g
app.use(requestLogger); // Log requests
// serve static files
app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/user', userRouter);

app.use('/tools', toolRouter);

app.use('/glossary', glossaryRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
