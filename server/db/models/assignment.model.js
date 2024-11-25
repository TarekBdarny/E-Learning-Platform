import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
    hint: {
      type: String,
    },
    hintUnlockTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const assignmentModel = mongoose.model("Assignment", assignmentSchema);

export default assignmentModel;
