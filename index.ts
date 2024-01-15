import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute";
import profileRoute from "./routes/profileRoute";

dotenv.config({ path: ".env" });

const app = express();

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/", profileRoute);

app.listen(3001, () => {
  console.log("Server started on port 3000");
});
