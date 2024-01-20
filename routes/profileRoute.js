import express from "express";
import {
  createProfile,
  getProfiles,
} from "../controllers/profileController.js";
import path from "path";
import multer from "multer";


const router = express.Router();


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images')
//   },
//   filename: (req, file, cb) => {
//     console.log(file)
//     cb(null, Date.now() + path.extname(file.originalname))
//   }

// })


// const upload = multer({ storage: storage });

router.post("/", createProfile);
router.get("/", getProfiles);
router.patch("/", createProfile);

export default router;
