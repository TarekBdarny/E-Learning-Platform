import userModel from "../db/models/user.model.js";
import classModel from "../db/models/class.model.js";
import assignmentModel from "../db/models/assignment.model.js";

export const createAssignment = async (req, res) => {
  const userId = req.user._id; // teacher Id
  const { title, description, deadline, fileUrl, hints, hintsUnlockTime } =
    req.body;
  const { id: classId } = req.params;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const classObj = await classModel.findOne({
      _id: classId,
      teacher: teacher._id,
    });
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (hints && !hintsUnlockTime)
      return res.status(400).json({ message: "Hints unlock time is required" });

    const assignment = await new assignmentModel({
      title,
      description,
      deadline,
      fileUrl,
      hints,
      hintsUnlockTime,
      class: classObj._id,
    }).save();
    classObj.assignments.push(assignment._id);
    await classObj.save();

    const students = classObj.students;

    await userModel.updateMany(
      {
        _id: { $in: students },
      },
      {
        $push: { assignments: assignment._id },
      }
    );
    return res
      .status(201)
      .json({ message: "assignment created successfully", data: assignment });
  } catch (error) {
    console.log("error in createAssignment controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const lockUnlockAssignment = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: assignmentId } = req.params; //
  const { lockAssignment } = req.body;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const assignment = await assignmentModel.findByIdAndUpdate(assignmentId, {
      locked: lockAssignment,
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    return res.status(200).json({ message: "assignment locked successfully" });
  } catch (error) {
    console.log("error in lockAssignment controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//TODO: handle getAllAssignments
//TODO: handle extendDeadline
//TODO: handle deleteAssignment
