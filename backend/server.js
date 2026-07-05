import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./connector.js";
import authRoute from "./routes/auth.js";
import jwt from "jsonwebtoken";


dotenv.config();
const jwtsecret = process.env.JWT_SECRET;


const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://golden.bajpai.dev"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

));
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
