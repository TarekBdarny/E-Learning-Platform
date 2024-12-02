import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // professor
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Students in the whole course
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // pending requests from teachers to join the course
    studentsPendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Course", courseSchema);

export default courseModel;
