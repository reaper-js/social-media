import multer from 'multer';
import path from 'path';
import { getAllMedia, uploadMedia } from '../controllers/mediaController.js';
import express from 'express';
import auth from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mkv|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  },
});

const router  = express.Router();

router.post('/upload',  auth, upload.single('media'), uploadMedia);
router.get('/', auth, getAllMedia);

export default router;