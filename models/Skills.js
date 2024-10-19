const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const skillsSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "Users",
    required: true,
  },
  skills: {
    type: [
      {
        id: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Skills", skillsSchema);
