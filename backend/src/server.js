import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

dotenv.config();

connectDB();

app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Frontend URL
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
