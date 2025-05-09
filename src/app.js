const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Import routes (auth and task routes)
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');
const profileRouter = require('./routes/profile');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", taskRouter);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection failed:", err.message);
    process.exit(1);
  });
