import userModel from "../db/models/user.model.js";
import courseModel from "../db/models/course.model.js";
import classModel from "../db/models/class.model.js";
export const createClass = async (req, res) => {
  const userId = req.user._id;
  const { title, description, startTime, endTime, liveVideoLink } = req.body;
  const { id: courseId } = req.params;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!course.teachers.includes(teacher))
      return res.status(403).json({
        message: "Unauthorized - You are not the teacher in this course",
      });
    const newClass = await new classModel({
      title,
      description,
      startTime,
      endTime,
      liveVideoLink,
      course: courseId,
      teacher: userId,
    }).save();
    return res
      .status(200)
      .json({ message: "class created successfully", data: newClass });
  } catch (error) {
    console.log("error in createClass controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const acceptStudentRequest = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: classId } = req.params; //
  const { id: studentId } = req.body; // student id
  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const classObj = await classModel.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (!classObj.teacher.equals(teacher._id))
      return res.status(403).json({
        message: "Unauthorized - You are not the teacher in this class",
      });
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (classObj.students.includes(student._id))
      return res
        .status(400)
        .json({ message: "Student is already in the class" });
    classObj.students.push(student._id);
    await classObj.save();
    await classModel.updateOne(
      { _id: classObj._id },
      {
        $pull: { pendingRequests: student._id },
      }
    );
    await courseModel.updateOne(
      {
        "classes._id": classObj._id,
      },
      {
        $push: { students: student._id },
        $inc: { numberOfStudents: 1 },
      }
    );
    //TODO: update the dashboard and notify with socket.io
    return res.status(200).json({ message: "user accepted successfully" });
  } catch (error) {
    console.log("error in acceptStudentRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const rejectStudentRequest = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: classId } = req.params; //
  const { id: studentId } = req.body; // student id

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const classObj = await classModel.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (!classObj.teacher.equals(teacher._id))
      return res.status(403).json({
        message: "Unauthorized - You are not the teacher in this class",
      });
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await classModel.updateOne(
      { _id: classObj._id },
      { $pull: { pendingRequests: student._id } }
    );
    //TODO: update the dashboard and notify with socket.io

    return res.status(200).json({ message: "user rejected successfully" });
  } catch (error) {
    console.log("error in rejectStudentRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getPendingRequestsToJoin = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: classId } = req.params; //

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const classObj = await classModel.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (!classObj.teacher.equals(teacher._id))
      return res.status(403).json({
        message: "Unauthorized - You are not the teacher in this class",
      });

    const pendingRequests = classObj.pendingRequests;
    return res
      .status(200)
      .json({ message: "pending requests", data: pendingRequests });
  } catch (error) {
    console.log("error in getPendingRequestsToJoin controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllStudentsInClass = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: classId } = req.params; //

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

    const students = classObj.students;
    return res
      .status(200)
      .json({ message: "students in class", data: students });
  } catch (error) {}
};
export const getAllMyClasses = async (req, res) => {
  const userId = req.user._id; // teacher id

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const classes = await classModel.find({ students: userId });
    return res.status(200).json({ message: "success", data: classes });
  } catch (error) {
    console.log("error in getAllMyClasses controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const inviteStudentToClass = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: classId } = req.params; //
  const { username } = req.body; // student's username

  try {
    const classObj = await classModel.findOne({
      _id: classId,
      teacher: userId,
    });
    if (!classObj) {
      return res.status(404).json({ message: "classObj not found Or " });
    }
    const student = await userModel.findOne({ username });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (classObj.students.includes(student._id))
      return res
        .status(400)
        .json({ message: "Student is already in the class" });

    await userModel.updateOne(
      {
        _id: student._id,
      },
      {
        $push: { pendingRequests: classObj._id },
      }
    );
  } catch (error) {
    console.log("error in inviteStudentToClass controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getNumberOfStudents = async (req, res) => {};
export const removeStudentFromClass = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id: classId } = req.params; //
  const { id: studentId } = req.body; // student id

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const classObj = await classModel.findOne({
      _id: classId,
      teacher: userId,
    });
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }
    const student = await userModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!classObj.students.includes(student._id))
      return res.status(400).json({ message: "Student is not in the class" });
    await classModel.updateOne(
      { _id: classObj._id },
      { $pull: { students: student._id } }
    );
    await userModel.updateOne(
      { _id: student._id },
      { $pull: { classes: classObj._id } }
    );
    // TODO: update course model

    // TODO: update dashboard and notify with socket.io

    return res.status(200).json({ message: "student removed successfully" });
  } catch (error) {
    console.log("error in removeStudentFromClass controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
