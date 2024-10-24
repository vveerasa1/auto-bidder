const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const Skills = require("../models/Skills");

const getAllSkillsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  try {
    // Fetch all skills for the given userId
    const skills = await Skills.findOne({ userId }).exec();

    return res
      .status(200)
      .json(new ApiResponse(200, skills, "Gathered User skills"));
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while fetching skills",
      error.message
    );
  }
});

module.exports = { getAllSkillsForUser };
