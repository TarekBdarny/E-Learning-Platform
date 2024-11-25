import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

const submissionModel = mongoose.model("Submission", submissionSchema);

export default submissionModel;
