const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const Templates = require("../models/Templates");
const AITemplates = require("../models/AiTemplates");
const AiTemplates = require("../models/AiTemplates");
const Skills = require("../models/Skills");
const { default: mongoose } = require("mongoose");

const addTemplate = asyncHandler(async (req, res) => {
  const { userId, category, content, skills } = req.body;

  // Validate that all required fields are present
  if (!userId || !category || !content) {
    message = "User ID, category, content, and skills are all required.";
    throw new ApiError(400, message);
  }

  try {
    // Create a new template
    const template = new Templates({
      userId,
      category,
      content,
      skills,
    });

    // Save the template to the database
    const savedTemplate = await template.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, savedTemplate, "Template created successfully")
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to create template", error.message);
  }
});

const getAllTemplates = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 templates per page

  // Validate that userId is provided
  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  try {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Find all templates by userId, sorted by createdAt in descending order
    const templates = await Templates.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get the total count of templates for the userId
    const totalTemplates = await Templates.countDocuments({ userId });

    // Check if templates are found
    if (!templates || templates.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, [], "No templates found for the specified user.")
        );
    }
    const result = {
      templates,
      skillLength: skillLength[0].skills.length,
    };

    // Group templates by category
    const groupedTemplates = templates.reduce((acc, template) => {
      const category = template.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    }, {});

    // Define the desired category order
    const categoryOrder = [
      "Greeting",
      "Introduction",
      "Skills",
      "Closing Line",
      "Signature",
    ];

    // Sort categories according to the defined order and filter out categories that are not in the list
    const sortedTemplates = categoryOrder
      .filter((category) => groupedTemplates[category]) // Only include categories that exist
      .map((category) => ({
        category,
        templates: groupedTemplates[category],
      }));

    // Send a success response with the grouped and sorted templates, including pagination info
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          templates: sortedTemplates,
          currentPage: page,
          totalPages: Math.ceil(totalTemplates / limit),
          totalTemplates,
        },
        "Templates retrieved successfully."
      )
    );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to retrieve templates.");
  }
});

const updateTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { userId, category, content } = req.body;

  // Validate that templateId and all required fields are present
  if (!templateId || !userId || !category || !content) {
    throw new ApiError(
      400,
      "Template ID, User ID, category, content, and skills are all required."
    );
  }

  try {
    // Find the template by ID and update it
    const updatedTemplate = await Templates.findByIdAndUpdate(
      templateId,
      {
        $set: {
          userId: req.body.userId,
          category: req.body.category,
          content: req.body.content,
          skills: req.body.skills,
        },
      },
      { new: true } // To return the updated document
    );

    // Check if the template exists
    if (!updatedTemplate) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Template not found."));
    }

    // Send a success response with the updated template
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedTemplate, "Template updated successfully.")
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to update template.", error.message);
  }
});

const getTemplateById = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  // Validate that templateId is provided
  if (!templateId) {
    throw new ApiError(400, "Template ID is required.");
  }

  try {
    // Find the template by ID
    const template = await Templates.findById(templateId);

    // Check if the template exists
    if (!template) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Template not found."));
    }

    // Send a success response with the found template
    return res
      .status(200)
      .json(new ApiResponse(200, template, "Template retrieved successfully."));
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to retrieve template.", error.message);
  }
});

const deleteTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  // Validate that templateId is provided
  if (!templateId) {
    throw new ApiError(400, "Template ID is required.");
  }

  try {
    // Find the template by ID and delete it
    const deletedTemplate = await Templates.findByIdAndDelete(templateId);

    // Check if the template was found and deleted
    if (!deletedTemplate) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Template not found."));
    }

    // Send a success response with the deleted template
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedTemplate, "Template deleted successfully.")
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to delete template.", error.message);
  }
});

const addAITemplate = asyncHandler(async (req, res) => {
  const { userId, wordsCount, content, skills, portfolioLinks } = req.body;

  // Validate that all required fields are present
  if (!userId || !content || !wordsCount) {
    message =
      "User ID, category, content, skills, wordsCount, portfolioLinks are all required.";
    throw new ApiError(400, message);
  }

  try {
    // Create a new template
    const template = new AITemplates({
      userId,
      content,
      skills,
      wordsCount,
      portfolioLinks,
    });

    // Save the template to the database
    const savedTemplate = await template.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, savedTemplate, "AI Template created successfully")
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to create AI template", error.message);
  }
});

const getAllAITemplates = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Validate that userId is provided
  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  try {
    // Find all templates by userId
    const templates = await AITemplates.find({ userId });

    // Check if templates are found
    if (!templates || templates.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, [], "No templates found for the specified user.")
        );
    }

    // Send a success response with the found templates
    return res
      .status(200)
      .json(
        new ApiResponse(200, templates, "AI Templates retrieved successfully.")
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to retrieve AI templates.");
  }
});

const getAITemplateById = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  // Validate that templateId is provided
  if (!templateId) {
    throw new ApiError(400, "AI Template ID is required.");
  }

  try {
    // Find the template by ID
    const template = await AiTemplates.findById(templateId);

    // Check if the template exists
    if (!template) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "AI Template not found."));
    }

    // Send a success response with the found template
    return res
      .status(200)
      .json(
        new ApiResponse(200, template, "AI Template retrieved successfully.")
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to retrieve AI template.", error.message);
  }
});

const updateAITemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { userId, wordsCount, content, skills, portfolioLinks } = req.body;

  // Validate that templateId and all required fields are present
  if (!userId || !content || !wordsCount) {
    message =
      "User ID, wordscount, content, skills, wordsCount, portfolioLinks are all required.";
    throw new ApiError(400, message);
  }

  try {
    // Find the template by ID and update it
    const updatedTemplate = await AiTemplates.findByIdAndUpdate(
      templateId,
      { userId, wordsCount, content, skills, portfolioLinks },
      { new: true, runValidators: true }
    );

    // Check if the template exists
    if (!updatedTemplate) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "AI Template not found."));
    }

    // Send a success response with the updated template
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedTemplate,
          "AI Template updated successfully."
        )
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to update template.", error.message);
  }
});

const deleteAiTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  // Validate that templateId is provided
  if (!templateId) {
    throw new ApiError(400, "AI Template ID is required.");
  }

  try {
    // Find the template by ID and delete it
    const deletedTemplate = await AITemplates.findByIdAndDelete(templateId);

    // Check if the template was found and deleted
    if (!deletedTemplate) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "AI Template not found."));
    }

    // Send a success response with the deleted template
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedTemplate,
          "AI Template deleted successfully."
        )
      );
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Failed to delete AI template.", error.message);
  }
});

module.exports = {
  addTemplate,
  getAllTemplates,
  updateTemplate,
  getTemplateById,
  deleteTemplate,
  addAITemplate,
  getAllAITemplates,
  getAITemplateById,
  updateAITemplate,
  deleteAiTemplate,
};
