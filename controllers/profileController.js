import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
import { Profile, User } from "../schemas/allSchemas.js";
dotenv.config();

const linkSchema = z.object({
  url: z.string().url(),
  platform: z.string(),
});

const createProfileSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  links: z.array(linkSchema).optional(),
  token: z.string(),
});

const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const createProfile = [
  validateBody(createProfileSchema),
  async (req, res) => {
    try {
      let decoded;
      try {
        decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      } catch (error) {
        res.status(400).send({ error: "Invalid token" });
        return;
      }

      const profileData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        userId: decoded.userId,
        links: req.body.links,
      };

      const profile = await Profile.findOneAndUpdate(
        { userId: decoded.userId },
        profileData,
        { upsert: true, new: true, runValidators: true }
      );

      if (!profile) {
        res.json({ message: "Profile created successfully", profile });
      } else {
        res.json({ message: "Profile updated successfully", profile });
      }
    } catch (error) {
      console.error("Error creating or updating profile and links", error);
      res.status(500).send({ error: error.message });
    }
  },
];

export const getProfiles = async (req, res) => {
  const { name, token } = req.query;

  if (typeof name === "string") {
    const user = await User.findOne({ name });

    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const profiles = await Profile.find({ userId: user._id });

    res.status(200).json(profiles);
  } else if (typeof token === "string") {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      res.status(400).send({ error: "Invalid token" });
      return;
    }

    const profiles = await Profile.find({ userId: decoded.userId });

    res.status(200).json(profiles);
  } else {
    res.status(400).send({ error: "Either name or token is required" });
  }
};
