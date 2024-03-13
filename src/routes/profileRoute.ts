import express from "express";
import {
  createProfile,
  getProfiles,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/", getProfiles);

export default router;
