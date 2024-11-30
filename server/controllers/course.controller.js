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
export const requestToJoinCourse = async (req, res) => {
  const userId = req.user._id; // student id
  const { id: courseId } = req.params; // course id

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.students.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }
    await courseModel.updateOne(
      { _id: course._id },
      {
        $push: { pendingRequests: userId },
      }
    );

    return res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.log("error in requestToJoinCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptRequestToJoinCourse = async (req, res) => {
  const userId = req.user._id; // instructor id
  const { id: courseId } = req.params; // course id
  const { studentId } = req.body;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (teacher.role === "Student")
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });

    const course = await courseModel.findOne({
      _id: courseId,
      teacher: userId,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await userModel.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!course.pendingRequests.includes(studentId))
      return res
        .status(400)
        .json({ message: "This user is not pending to join this course" });
    // Accept request and add student to course
    // remove the student from the pending requests
    await courseModel.updateOne(
      { _id: course._id },
      {
        $pull: { pendingRequests: student._id },
      }
    );
    // Add student to the course students
    await courseModel.updateOne(
      { _id: course._id },
      {
        $push: { students: student._id },
      }
    );
    // add the course in user courses
    await userModel.updateOne(
      { _id: student._id },
      {
        $push: { courses: course._id },
      }
    );
    return res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.log("error in acceptRequestToJoinCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const acceptAllJoinRequests = async (req, res) => {
  const userId = req.user._id;
  const { id: courseId } = req.params;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) return res.status(404).json({ message: "User not found" });
    if (teacher.role === "Student")
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.pendingRequests.length < 0) {
      return res.status(400).json({ message: "No pending requests to accept" });
    }
    const pendingRequests = course.pendingRequests;

    await courseModel.updateOne(
      { _id: course._id },
      {
        $pullAll: { pendingRequests },
        $push: { students: { $each: pendingRequests } },
      }
    );
    // add the course in user courses
    await Promise.all(
      pendingRequests.map(async (studentId) => {
        const student = await userModel.findById(studentId);
        if (student) {
          await userModel.updateOne(
            { _id: student._id },
            {
              $push: { courses: course._id },
            }
          );
        }
      })
    );

    return res.status(200).json({ message: "All requests accepted" });
    return res.status(200).json({ message: "All requests accepted" });
  } catch (error) {
    console.log("error in acceptAllJoinRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllStudentsInCourse = async (req, res) => {
  const userId = req.user._id; // teacher
  const { id: courseId } = req.params;

  try {
    const teacher = await userModel.findById(userId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (teacher.role === "Student")
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });
    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const students = await userModel
      .find({ _id: { $in: course.students } })
      .select("-password");
    return res
      .status(200)
      .json({ message: "Students in the course", data: students });
  } catch (error) {}
};
