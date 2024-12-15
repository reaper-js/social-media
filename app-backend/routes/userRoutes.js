import express from "express";
import { registerUser, loginUser, verifyUser, checkUsername, searchUsers, getProfile, logout, logoutAll, followUser, unfollowUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const router = express.Router();
import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/profilePictures/'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only image and video files are allowed!'));
      }
    },
  });

router.post("/register", upload.single('avatar'), registerUser);
router.post("/login", loginUser);
router.get("/verify", auth, verifyUser);
router.get("/checkUsername/:username", checkUsername);
router.get("/searchUsers", auth, searchUsers);
router.get("/getProfile/:userId", auth, getProfile);

router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);

router.post('/follow/:userId', auth, followUser);
router.post('/unfollow/:userId', auth, unfollowUser);

export default router;
