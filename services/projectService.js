const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/User");
const { getAllActiveProjects } = require("../utils/freelancerApi/projects");

const getAllProjects = asyncHandler(async (req, res) => {
  const { limit, query } = req.query;
  const { freelancerId } = req.params;

  if (!freelancerId) {
    throw new ApiError(500, "userId is required");
  }

  //get freelancerV1-token from Users
  const token = await User.aggregate([
    {
      $match: {
        freelancerId: freelancerId,
      },
    },
    {
      $project: {
        tokenData: 1,
      },
    },
  ]);
  const { access_token } = token;
  const activeProjects = await getAllActiveProjects(limit, access_token);

  if (!activeProjects.success) {
    throw new ApiError(500, "unable to get active projects");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, activeProjects, "token received"));
});

module.exports = { getAllProjects };
