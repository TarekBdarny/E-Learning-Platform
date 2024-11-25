import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "User", "Teacher"],
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
