const express = require("express");
const { addTemplate, getAllTemplates, updateTemplate, getTemplateById, deleteTemplate, addAITemplate, getAllAITemplates, getAITemplateById, updateAITemplate, deleteAiTemplate } = require("../services/templateService");

const router = express.Router();

//GET -projects/:freelancerId get all active projects
router.post("/", addTemplate);
router.get("/", getAllTemplates);
router.put("/:templateId", updateTemplate);
router.get("/:templateId", getTemplateById);
router.delete("/:templateId",deleteTemplate);


module.exports = router;