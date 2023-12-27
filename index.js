import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import ownerRouter from "./routes/owner.route.js";
import postRouter from "./routes/post.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log("conected to mongoDB");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

connectDB();

const app = express();

const corsOrigin = {
  origin: "http://localhost:5173/",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOrigin));

app.use(express.json());

app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log("server is running");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/post", postRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello this is / route",
  });
});
