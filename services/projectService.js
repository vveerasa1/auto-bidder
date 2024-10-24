const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const User = require("../models/User");
const Skills = require("../models/Skills");
const AITemplate = require("../models/AiTemplates")
const {
  getAllActiveProjects,
  findRequiredSkills,
  addRequiredSkills,
  placeBidForProjects,
} = require("../utils/freelancerApi/projects");
const {
  convertUserSkillToString,
  findMissingSkills,
} = require("../utils/utils");
const { default: mongoose } = require("mongoose");
const { generateBidMessage } = require("../utils/chatgpApi/messageTemplate");

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

const placeBid = asyncHandler(async (req, res) => {
  //project id , user id
  const { projectId, freelancerId, bidPrice } = req.body;
  if (!projectId || !freelancerId || !bidPrice) {
    throw new ApiError(500, "projectId , freelancerId, bidPrice is required");
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
        _id: 1,
        freelancerId: 1,
        displayName: 1,
        tokenData: 1,
      },
    },
  ]);
  //user access token
  const { access_token } = token[0]?.tokenData;

  //find the project required skills
  const requiredSkills = await findRequiredSkills(projectId, access_token);

  if (!requiredSkills.success) {
    throw new ApiError(500, "unable to fetch required skills");
  }

  const { title: project_title, owner } = requiredSkills?.projectDetails;

  /* Find the skills we missed to bid for this project */

  //Find the skills we have
  const { _id: ObjectId, displayName } = token[0];
  const freelancerSkills = await Skills.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(ObjectId), // Convert string to ObjectId
      },
    },
    {
      $project: {
        skills: 1,
      },
    },
  ]);

  //missed skills
  const missingSkills = findMissingSkills(
    freelancerSkills[0].skills,
    requiredSkills.data
  );

  if (missingSkills.missingSkills.length > 0) {
    throw new ApiError(500, missingSkills.missingSkills);
  }

  // add the missing skills to the job
  // const isJobAdded = await addRequiredSkills(missingSkills, access_token);

  //create description from the chatGpt
  const projectData = {
    projectName: project_title,
    username: displayName,
    skills: freelancerSkills[0].skills.map((skill) => skill.name).join(","),
    owner_name: owner.public_name,
  };

  const generateMessage = await generateBidMessage(projectData);

  if (!generateMessage.success) {
    throw new ApiError(
      500,
      "unable to generate description from chatGPT",
      generateMessage.error
    );
  }

  //place-bid using chatGPT's description
  /**
   * * BODY_DATA
   * project_id
   * bidder_id
   * amount
   * period
   * milestone_percentage
   * description
   */

  //"generateMessage.data" NEE TO REPLACE
  const biddingData = {
    description: generateMessage.data,
    project_id: Number(projectId),
    bidder_id: Number(freelancerId),
    amount: Number(bidPrice), //as per project currency
    period: 7, //in days
    milestone_percentage: 100,
  };
  const isBiddingCompleted = await placeBidForProjects(
    biddingData,
    access_token
  );

  if (!isBiddingCompleted.success) {
    throw new ApiError(
      500,
      "unable to bid for this project",
      isBiddingCompleted.error
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, isBiddingCompleted.data, "projects retrieved"));
});
module.exports = { getAllProjects, placeBid };
