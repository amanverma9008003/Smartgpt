import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import router from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS BEFORE routes
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // local frontend (Vite)
      "https://smartact.netlify.app"    // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Parse JSON before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Use your routes AFTER middleware
app.use("/api", router);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
  }
};

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
