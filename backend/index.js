const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRouter = require("./routes/authRouter");
const taskRouter = require("./routes/taskRouter");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: "https://ramu-task-manager.netlify.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("Connected to DB");
    console.log("Server running");
  } catch (err) {
    console.log(err);
  }
});
