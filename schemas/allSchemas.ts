import mongoose, { Schema, Document } from "mongoose";

// Define Link schema
const LinkSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
});

export interface ILink extends Document {
  platform: string;
  url: string;
}

// Define Profile schema
const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  links: [LinkSchema],
});

export interface IProfile extends Document {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  links: ILink[];
}

// Define User schema
const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
});

export interface IUser extends Document {
  name: string;
  password: string;
  profiles: IProfile[];
}

// Create models
export const Link = mongoose.model<ILink>("Link", LinkSchema);
export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
export const User = mongoose.model<IUser>("User", UserSchema);
