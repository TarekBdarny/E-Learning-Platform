import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
      },
    ],
    hints: [
      {
        type: String,
      },
    ],
    hintsUnlockTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const assignmentModel = mongoose.model("Assignment", assignmentSchema);

export default assignmentModel;
