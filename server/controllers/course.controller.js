import userModel from "../db/models/user.model.js";
import courseModel from "../db/models/course.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
export const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Student") {
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });
    }
    const newCourse = new courseModel({
      title,
      description,
      courseId: generateVerificationToken(),
      teacher: userId,
    });
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course Created successfully", data: newCourse });
  } catch (error) {}
};

export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.find({}).populate({
      path: "teacher",
      select: "-password",
    });
    res.status(200).json(courses);
  } catch (error) {
    console.log("error in getCourses controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const addStudentToCourse = async (req, res) => {
  const userId = req.user._id; // teacher id
  const { id } = req.params; // course id
  const { studentId } = req.body; // student id
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Student") {
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });
    }

    const userToJoin = await userModel.findById(studentId);
    if (!userToJoin) {
      return res.status(404).json({ message: "User to join not found" });
    }
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized - You are not the instructor of this course",
      });
    }

    if (course.students.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course" });
    }

    course.students.push(studentId);
    await course.save();
    res.status(200).json({ message: "User added successfully to course" });
  } catch (error) {
    console.log("error in addStudentToCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
