import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryPackage from 'cloudinary';
import jwt from 'jsonwebtoken';
import Video from '../models/Video.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
// ...existing code...


const router = express.Router();

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//For console log env Cloudinary check

// console.log('Cloudinary ENV:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Add this for HTTPS
});

// Set up storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'strmly_videos',
    resource_type: 'video',
    format: 'mp4',
  },
});

const upload = multer({ storage });

// Upload video
// router.post('/upload', upload.single('video'), async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
    
//     if (!user) return res.status(404).json({ message: 'User not found' });
    
//     const newVideo = new Video({
//       title: req.body.title,
//       description: req.body.description,
//       videoUrl: req.file.path,
//       uploader: user._id,
//       uploaderName: user.name,
//     });
    
//     await newVideo.save();
//     res.status(201).json(newVideo);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    console.log('Upload request received');
    
    // Check token
    if (!req.headers.authorization) {
      console.log('No authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`User not found with ID: ${decoded.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if file exists
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    
    console.log('File uploaded to Cloudinary:', req.file.path);
    
    // Create video entry
    const newVideo = new Video({
      title: req.body.title,
      description: req.body.description,
      videoUrl: req.file.path,
      uploader: user._id,
      uploaderName: user.name,
    });
    
    await newVideo.save();
    console.log(`Video saved: ${newVideo._id}`);
    res.status(201).json(newVideo);
    
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message // Send actual error to client
    });
  }
});


// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;