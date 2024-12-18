
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import mediaRoutes from './routes/mediaRouters.js'
import bodyParser from 'body-parser';

dotenv.config();
connectDB({
  origin: 'http://localhost:3000',
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public/profilePictures', express.static(path.join(__dirname, 'public/profilePictures')));


// Routes
app.use('/users', userRoutes);
app.use('/media', mediaRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
