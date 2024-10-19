const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/User");
const { getAllActiveProjects } = require("../utils/freelancerApi/projects");
const { convertUserSkillToString } = require("../utils/utils");

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

  //need to return the skills array
  const userSkills = await User.aggregate([
    {
      $match: {
        freelancerId: Number(freelancerId), // Match the user with the specified freelancerId
      },
    },
    {
      $lookup: {
        from: "skills", // The name of the skills collection
        localField: "_id", // Field from the input documents (Users) to match
        foreignField: "userId", // Field from the skills documents to match
        as: "skills", // Name of the new array field to add
      },
    },
    {
      $unwind: {
        path: "$skills",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id", // Group by user ID
        skills: { $first: "$skills" }, // Get the first skill
      },
    },
    {
      $project: {
        skills: 1,
      },
    },
  ]);
  const skillsResult = convertUserSkillToString(userSkills[0]);

  const activeProjects = await getAllActiveProjects(
    limit,
    skip,
    access_token,
    skillsResult
  );

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
