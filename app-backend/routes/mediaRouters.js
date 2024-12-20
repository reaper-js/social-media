import multer from 'multer';
import path from 'path';
import { getAllMedia, uploadMedia, getFeed, getPosts, getPost, addComment, toggleLike } from '../controllers/mediaController.js';
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
    const filetypes = /jpeg|jpg|png|mp4|mkv|avi|mov|m4v|webm|wmv|flv|h264|3gp|quicktime|mpeg|mpg|mpe|qt|rm|swf|vob|ogg|ogv|gif|webp|svg|tiff|tif|bmp|ico/;
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
router.get('/feed', auth, getFeed);
router.get('/getPosts/:userId', auth, getPosts);
router.get('/getPost/:postId', auth, getPost);
router.post('/postComment/:postId', auth, addComment);
router.post('/toggleLike/:postId', auth, toggleLike);


export default router;