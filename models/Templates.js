const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const templatesSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "Users",
      required: true,
    },
    category: {
      type: String,
    },
    content: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Templates", templatesSchema);
