import { decodeToken } from "../util/decode.js";
import { verifyToken } from "../util/verifyToken.js";
import { z } from "zod";
import dotenv from "dotenv";
import { Profile, User } from "../schemas/allSchemas.js";
dotenv.config();

const linkSchema = z.object({ url: z.string().url(), platform: z.string() });

const createProfileSchema = z.object({
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
  email: z.string().email().optional(),
  links: z.array(linkSchema).optional(),
});

const getProfileSchema = z.object({
  name: z.string().optional(),
  token: z.string().optional(),
});

function createProfileData(req, decoded) {
  const { firstName, lastName, email, links } = createProfileSchema.parse(
    req.body,
  );

  // Build profile data object with user ID and validated properties from request body
  const profileData = {
    userId: decoded.userId,
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(email && { email }),
    ...(links && { links }),
  };

  return profileData;
}

export const createProfile = async (req, res) => {
  try {
    const decoded = verifyToken(req.headers.token);
    const profileData = createProfileData(req, decoded);

    const profile = await Profile.findOneAndUpdate(
      { userId: decoded.userId },
      profileData,
      { upsert: true, new: true, runValidators: true },
    );

    await User.findOneAndUpdate(
      { _id: decoded.userId },
      { profile: profile._id },
    );
    if (!profile) {
      res.json({ message: "Profile created successfully", profile });
    } else {
      res.json({ message: "Profile updated successfully", profile });
    }
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error("Error creating or updating profile and links", error);
    res.status(500).send({ error: error.message });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const { name, token } = getProfileSchema.parse(req.query);
    // if name is provided, find profile by name
    if (name) {
      const user = await User.findOne({ name });

      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }
      const profiles = await Profile.find({ userId: user._id });

      return res.status(200).json(profiles);
    } else if (token) {
      // else profile by token
      const decoded = decodeToken(token);
      const profiles = await Profile.find({ userId: decoded.userId });

      return res.status(200).json(profiles);
    }
  } catch (err) {
    res.status(400).send({ error: "Either name or token is required", err });
  }
};
