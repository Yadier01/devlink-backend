import mongoose, { Schema, Document } from "mongoose";

const LinkSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
});
const imageSchema = new Schema({
  image: { type: String }, // make this field required
});

const ProfileSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  userId: { type: String, required: true, unique: true },
  links: [LinkSchema],
  image: imageSchema, // this field now expects an object with an 'image' property
});;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
});

export const Link = mongoose.model("Link", LinkSchema);
export const Profile = mongoose.model("Profile", ProfileSchema);
export const User = mongoose.model("User", UserSchema);
