import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // if you want to search any field in this case username, it is recommended to  make the index true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    fullname: { type: String, required: true, trim: true, index: true },
    avatar: {
      type: String, // cloudinary url will be used
      required: true,
    },
    coverImage: { type: String }, //cloudinary url will be used
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    password: { type: String, required: [true, "Password is required"] },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

//hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// comparing password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Access Token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
//Refresh Token
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const User = mongoose.model("User", userSchema);
export default User;
