const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const AiTemplatesSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "Users",
        required: true,
      },
      wordsCount: {
        type: Number,
        min: 50,  // Minimum value of 50
        max: 250, // Maximum value of 250
        required: true,
    },
     content: {
        type:String
     },
     skills : {
        type: [String]
     },
     portfolioLinks : {
        type:String
     }

})

module.exports = mongoose.model("AITemplates", AiTemplatesSchema);