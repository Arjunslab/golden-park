import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./connector.js";
import authRoute from "./routes/auth.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend" ;
import crypto from "crypto" ;
import { getOtpTemplate , getWelcomeTemplate } from "./emails/templates.js";


dotenv.config();
const jwtsecret = process.env.JWT_SECRET;
const otp = crypto.randomInt(100000, 1000000).toString();
const resend = new Resend(process.env.RESEND_KEY);

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://golden.bajpai.dev"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the Arora Portal API");
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
