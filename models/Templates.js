const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const templatesSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "Users",
        required: true,
      },
     category: {
        type: String
     },
     content: {
        type:String
     },
     skills : {
        type: [String]
     }

})

module.exports = mongoose.model("Templates", templatesSchema);