import express from "express";
import {
  createProfile,
  editProfile,
  getProfiles,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/", getProfiles);
router.patch("/", editProfile);

export default router;