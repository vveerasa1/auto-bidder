const express = require("express");
const { addAITemplate, getAllAITemplates, getAITemplateById, updateAITemplate, deleteAiTemplate } = require("../services/templateService");

const router = express.Router();

router.post("/",addAITemplate);
router.get("/",getAllAITemplates);
router.get("/:templateId",getAITemplateById);
router.put("/:templateId",updateAITemplate);
router.delete("/:templateId",deleteAiTemplate);

module.exports = router;