import express from 'express';
import { getMe, login, logout, signup, updateProfile } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", protectRoute, upload.single('profilePic'), updateProfile);

export default router;
