import mongoose from "mongoose";
import jwt from "jsonwebtoken";
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
      enum: ["Admin", "Professor", "Student", "Teacher"],
      default: "Student",
    },
    username: {
      type: String,
    },
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    provider: { type: String, required: true }, // The provider name, e.g., 'google', 'github'
    providerId: { type: String, required: true }, // The unique provider ID, e.g., 'google-sub-id' or 'github-id'

    email: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],

    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);
// userSchema.methods.generateJWT = function () {
//   const token = jwt.sign(
//     {
//       userId: this._id,
//       email: this.email,
//     },
//     process.env.JWT_SECRET_KEY,
//     {
//       expiresIn: "7d",
//     }
//   );
//   return token;
// };

const userModel = mongoose.model("User", userSchema);

export default userModel;
