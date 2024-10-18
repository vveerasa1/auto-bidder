const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/User");
const { getAllActiveProjects } = require("../utils/freelancerApi/projects");

const getAllProjects = asyncHandler(async (req, res) => {
  const { freelancerId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!freelancerId) {
    throw new ApiError(500, "userId is required");
  }

  //get freelancerV1-token from Users
  const token = await User.aggregate([
    {
      $match: {
        freelancerId: Number(freelancerId),
      },
    },
    {
      $project: {
        tokenData: 1,
      },
    },
  ]);
  //user access token
  const { access_token } = token[0]?.tokenData;

  const activeProjects = await getAllActiveProjects(limit, skip, access_token);

  if (!activeProjects.success) {
    throw new ApiError(500, "unable to get active projects");
  }

  const totalPages = Math.ceil(activeProjects?.data?.total_count / limit);
  const projectData = {
    projects: activeProjects?.data?.projects,
    project_owners: activeProjects?.data?.users,
    totalPages,
    currentPage: page,
    totalCounts: activeProjects?.data?.total_count,
  };
  return res
    .status(201)
    .json(new ApiResponse(200, projectData, "projects retrieved"));
});

module.exports = { getAllProjects };
