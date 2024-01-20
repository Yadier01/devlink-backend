import express from "express";
import {
  createProfile,
  getProfiles,
} from "../controllers/profileController.js";

import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date, now() + path.extname(file.originalname))
  }

})

const upload = multer({ storage: storage });
const router = express.Router();

router.post("/", upload.single("image"), createProfile);
router.get("/", getProfiles);
router.patch("/", upload.single("image"), createProfile);

export default router;
