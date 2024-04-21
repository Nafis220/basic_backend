import User from "../models/user.models.js";
import ApiError from "../utils/ApiErrors.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncFunctionHandler.js";
import fileUpload from "../utils/firebaseFileUpload.utils.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
  // take all data
  const { fullname, email, username, password } = req.body;
  // check all data is given or not
  if (
    [fullname, email, username, password].some((field) => {
      field === "";
    })
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  // check images
  const avatarPath = `${req.files?.avatar[0]?.path}`
    ? `${req.files?.avatar[0]?.path}`
    : null;
  const avatarFilename = `avatar/${req.files?.avatar[0]?.filename}`;

  const coverImagePath =
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
      ? `${req.files?.coverImage[0]?.path}`
      : null;
  const coverImagefilename =
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
      ? `coverImage/${req.files?.coverImage[0]?.filename}`
      : null;

  if (avatarPath === null) {
    throw new ApiError("400", "avatar file is required");
  }
  //check user already exist or not
  const userAlreadyExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userAlreadyExist) {
    fs.unlinkSync(avatarPath);

    if (coverImagePath != null) {
      fs.unlinkSync(coverImagePath);
    }

    throw new ApiError(409, "User with email or username already exist");
  }

  //saving to the firebase
  let avatarUrl;
  if (avatarFilename && avatarPath) {
    avatarUrl = await fileUpload(avatarPath, avatarFilename);
  }

  if (!avatarUrl) {
    throw new ApiError("400", "Avatar file is required");
  }
  let coverImageUrl;
  if (coverImagePath != null && coverImagefilename != null) {
    coverImageUrl = await fileUpload(coverImagePath, coverImagefilename);
  }

  // saving obj to database
  const user = await User.create({
    fullname,
    avatar: avatarUrl,
    coverImage: coverImageUrl || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // check user is created or not in the database
  const createdUser = await User.findById({ _id: user._id }).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    fs.existsSync(avatarPath) ?? fs.unlinkSync(avatarPath);
    fs.existsSync(coverImagePath) ?? fs.unlinkSync(coverImagePath);
    throw new ApiError(
      500,
      "Something went wrong in database while saivng the user"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully."));
});
export { registerUser };
