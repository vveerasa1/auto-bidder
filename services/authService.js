const bcrypt = require("bcrypt");

const User = require("../models/User");
const config = require("../config");
const { logger } = require("../logger");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { sentAuthorizationGrant } = require("../utils/freelancerApi/auth");

const addUser = asyncHandler(async (req, res, next) => {
  const { username, profileImage, email, password } = req.body;

  // Check for required fields
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    profileImage,
    email,
    password: hashedPassword,
  });

  // Save the new user to the database
  const savedUser = await newUser.save();

  // Log the successful creation
  console.info("New user created");

  // Return a successful response
  return res
    .status(201)
    .json(new ApiResponse(201, savedUser, "User created successfully"));
});

const addOauthUser = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    throw new ApiError(500, "please provide code");
  }
  const response = await sentAuthorizationGrant(code);

  //if authorization fails
  if (!response.success) {
    throw new ApiError(500, "user unable to authorize");
  }

  //else create user in database along access and Refresh token
  //if success create users
  const { tokendata } = response?.data;
  const {
    id: freelancerId,
    public_name,
    avatar_large_cdn,
    freelancer_verified_status,
    email,
    username,
  } = response?.data?.userdata?.data?.result;

  const password = `${username}@${String(freelancerId).slice(-4)}`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    freelancerId,
    username: username,
    displayName: public_name,
    profileImage:
      avatar_large_cdn == null
        ? "https://wrkbemanning.no/wp-content/uploads/2017/04/profile-pic-dummy.jpg"
        : `https:${avatar_large_cdn}`,
    email: email,
    active: freelancer_verified_status,
    password: hashedPassword,
    tokenData: tokendata,
  });

  try {
    const savedUser = await newUser.save();
    return res
      .status(201)
      .json(new ApiResponse(200, savedUser, "User created successfully"));
  } catch (error) {
    throw new ApiError(500, "unable to create user", error);
  }
});

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "ok", "health check passed"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  // Compare the hashed password with the provided password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(500, "Invalid credentials");
  }

  //destructure the user object
  const { password: _, tokenData, ...userData } = user.toObject();

  // Return a successful response (you may want to include a token here)
  res
    .status(200)
    .json(new ApiResponse(200, userData, "user logged in successfully"));
});

const redirect = asyncHandler(async (req, res) => {
  const { Oauth_URI, client_id, redirect_URI, prompt } = config.freelancer;
  const url = `${Oauth_URI}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_URI}&scope=basic&prompt=${prompt}`;
  return res.status(201).json(new ApiResponse(201, url, "url sent"));
});

module.exports = { addUser, loginUser, healthCheck, redirect, addOauthUser };
