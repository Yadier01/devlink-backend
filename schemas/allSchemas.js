import mongoose, { Schema, Document } from "mongoose";

const LinkSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
});

const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  links: [LinkSchema],
});

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
});

export const Link = mongoose.model("Link", LinkSchema);
export const Profile = mongoose.model("Profile", ProfileSchema);
export const User = mongoose.model("User", UserSchema);
