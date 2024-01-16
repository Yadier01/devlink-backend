import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";

dotenv.config({ path: ".env" });

const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/", profileRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server started on port 3000");
});