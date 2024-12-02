import assignmentModel from "../db/models/assignment.model.js";
import submissionModel from "../db/models/submission.model.js";
import userModel from "../db/models/user.model.js";

export const createSubmission = async (req, res) => {
  const userId = req.user._id; // submitter id
  const { id: assignmentId } = req.params; //
  const { fileUrl, text } = req.body;
  if (!fileUrl || !text)
    return res.status(400).json({ message: "one of the fields are required" });

  try {
    const student = await userModel.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });

    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    if (assignment.submissions.includes(student._id))
      return res
        .status(400)
        .json({ message: "You already submitted this assignment" });

    const newSubmission = await new submissionModel({
      student: student._id,
      assignment: assignment._id,
      fileUrl,
      text,
    }).save();
    assignment.submissions.push(newSubmission._id);
    await assignment.save();
    res.status(201).json({
      message: "Submission submitted successfully",
      data: newSubmission,
    });
  } catch (error) {
    console.log("error in createSubmission", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const gradeSubmission = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: submissionId } = req.params; //
  const { grade, feedback } = req.body;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const submission = await submissionModel.findById(submissionId);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();
    //TODO: notify student w mail / notification menu
    res.status(200).json({ message: "Submission graded successfully" });
  } catch (error) {
    console.log("error in gradeSubmission", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//TODO: delete submission
//TODO: getAllSubmissions
