import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
import { Profile, type IProfile, User } from "../schemas/allSchemas";
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

const validateBody =
  (schema: z.ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

export const createProfile = [
  validateBody(createProfileSchema),
  async (req: Request, res: Response) => {
    try {
      let decoded;
      try {
        decoded = jwt.verify(req.body.token, process.env.JWT_SECRET!) as {
          userId: string;
        };
      } catch (error) {
        res.status(400).send({ error: "Invalid token" });
        return;
      }

      const newProfile: IProfile = new Profile({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        userId: decoded.userId,
        links: req.body.links,
      });

      await newProfile.save();

      res.json({ message: "Profile created successfully" });
    } catch (error: any) {
      console.error("Error creating profile and links", error);
      res.status(500).send({ error: error.message });
    }
  },
];

export const getProfiles = async (req: Request, res: Response) => {
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
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
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

export const editProfile = [
  validateBody(createProfileSchema),
  async (req: Request, res: Response) => {
    try {
      let decoded;
      try {
        decoded = jwt.verify(req.body.token, process.env.JWT_SECRET!) as {
          userId: string;
        };
      } catch (error) {
        res.status(400).send({ error: "Invalid token" });
        return;
      }

      const profile = await Profile.findOne({ userId: decoded.userId });

      if (!profile) {
        res.status(404).send({ error: "Profile not found" });
        return;
      }

      const { firstName, lastName, email, links } = req.body;

      if (firstName) profile.firstName = firstName;
      if (lastName) profile.lastName = lastName;
      if (email) profile.email = email;

      if (links) {
        profile.links = links.filter((link: any) => link.platform && link.url);
      }

      await profile.save();

      res.status(200).send({ message: "Profile updated successfully" });
    } catch (error: any) {
      console.error("Error updating profile", error);
      res.status(500).send({ error: error.message });
    }
  },
];
