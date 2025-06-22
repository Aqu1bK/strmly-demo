import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('STRMLY API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// console.log('Cloudinary Config:', {
//   cloud: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
//   key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
//   secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
// });