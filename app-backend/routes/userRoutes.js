import express from "express";
import { registerUser, loginUser, verifyUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", auth, verifyUser);

export default router;