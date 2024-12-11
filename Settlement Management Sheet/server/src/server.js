import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/index.js';
import requestLogger from './middleware/requestLogger.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(cookieParser()); // Parse cookies
app.use(requestLogger); // Log requests
// serve static files
app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/user', userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
