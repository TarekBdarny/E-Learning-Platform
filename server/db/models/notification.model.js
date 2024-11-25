import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipient: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Assignment", "Class", "General"],
      default: "General",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;
