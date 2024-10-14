const bcrypt = require("bcrypt");

const User = require("../models/User");
const { logger } = require("../logger");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

// const addUser = async (req, res) => {
//   const { username, profileImage, email, password } = req.body;

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       profileImage,
//       email,
//       password: hashedPassword,
//     });

//     // Save the new user to the database
//     const savedUser = await newUser.save();
//     logger.info("new user is created");
//     // Return a successful response
//     res.status(200).json({
//       message: "User created successfully",
//       data: savedUser,
//       message: "Success",
//     });
//   } catch (error) {
//     console.error(error);

//     // Return an error response
//     res.status(500).json({
//       message: "Error creating user",
//       error: error.message,
//     });
//   }
// };

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

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "ok", "health check passed"));
});

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Return a successful response (you may want to include a token here)
    res.status(200).json({
      code: 200,
      message: "Login successful",
      data: {
        username: user.username,
        profileImage: user.profileImage,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    // Return an error response
    res.status(500).json({
      code: 500,
      message: "Error logging in",
      error: error.message,
    });
  }
};

module.exports = { addUser, loginUser, healthCheck };
