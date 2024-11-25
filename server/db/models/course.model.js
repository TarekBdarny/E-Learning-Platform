import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Course", courseSchema);

export default courseModel;
