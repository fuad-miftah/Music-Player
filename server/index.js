import express from "express"
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes.js";
import musicRoute from "./routes/music.routes.js";
import userRoute from "./routes/usser.routes.js"
import cors from "cors"
import connectToDatabase from "./config/db.js";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000

connectToDatabase();

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));


app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/music", musicRoute);
app.use("/api/users", userRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: "error",
    status: errorStatus,
    message: errorMessage
  });
});

app.listen(port, () => {
  console.log(`api started at port ${port}`)
})  