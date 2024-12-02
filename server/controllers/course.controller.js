import userModel from "../db/models/user.model.js";
import courseModel from "../db/models/course.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
//v
export const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "professor not found" });
    }
    if (user.role === "Student" || user.role === "Teacher") {
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not a professor" });
    }
    const newCourse = new courseModel({
      title,
      description,
      professor: userId,
    });
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course Created successfully", data: newCourse });
  } catch (error) {
    console.log("error in createCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//v when student search for course
export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.find({}).populate({
      path: "professor",
      select: "-password",
    });
    res.status(200).json(courses);
  } catch (error) {
    console.log("error in getCourses controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//v
export const acceptTeacherRequestToJoinCourse = async (req, res) => {
  const userId = req.user._id; // professor id
  const { id } = req.params; // course id
  const { teacherId } = req.body; // teacher id
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Student" || user.role === "Teacher") {
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });
    }

    const teacherToJoin = await userModel.findById(teacherId);
    if (!teacherToJoin) {
      return res.status(404).json({ message: "User to join not found" });
    }
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.professor.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized - You are not the instructor of this course",
      });
    }

    if (course.teachers.includes(teacherId)) {
      return res
        .status(400)
        .json({ message: "Teacher is already enrolled in this course" });
    }

    await courseModel.updateOne(
      { _id: course._id },
      {
        $push: { teachers: teacherId },
      }
    );
    res.status(200).json({ message: "Teacher added successfully to course" });
  } catch (error) {
    console.log("error in addStudentToCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//v
// add to pending requests
export const StudentsRequestsToJoinCourse = async (req, res) => {
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
        $push: { studentsPendingRequests: userId },
      }
    );

    return res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.log("error in requestToJoinCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptTeachersRequestToJoinCourse = async (req, res) => {
  const userId = req.user._id; // professor id
  const { id: courseId } = req.params; // course id
  const { teacherId } = req.body;

  try {
    const user = await userModel.findById(userId); // professor
    if (!user) return res.status(404).json({ message: "professor not found" });
    if (user.role === "Student" || user.role === "Teacher")
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });

    const course = await courseModel.findOne({
      _id: courseId,
      professor: userId,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const teacher = await userModel.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "teacher not found" });
    if (!course.pendingRequests.includes(teacherId))
      return res
        .status(400)
        .json({ message: "This user is not pending to join this course" });
    // Accept request and add teacher to course
    // remove the teacher from the pending requests
    await courseModel.updateOne(
      { _id: course._id },
      {
        $pull: { pendingRequests: teacher._id },
      }
    );
    // Add teacher to the course teachers
    await courseModel.updateOne(
      { _id: course._id },
      {
        $push: { teachers: teacher._id },
      }
    );
    // add the course in user courses
    await userModel.updateOne(
      { _id: teacher._id },
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
// v
export const acceptAllTeachersJoinRequests = async (req, res) => {
  const userId = req.user._id; // professor id
  const { id: courseId } = req.params; //

  try {
    const professor = await userModel.findById(userId);
    if (!professor) return res.status(404).json({ message: "User not found" });
    if (professor.role === "Student" || professor.role === "Teacher")
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });

    const course = await courseModel.findOne({
      _id: courseId,
      professor: userId,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const pendingRequests = course.pendingRequests;

    await courseModel.updateOne(
      { _id: course._id },
      {
        $pullAll: { pendingRequests },
        $push: { teachers: { $each: pendingRequests } },
      }
    );
    // add the course in user courses
    await Promise.all(
      pendingRequests.map(async (teacherId) => {
        const teacher = await userModel.findById(teacherId);
        if (teacher) {
          await userModel.updateOne(
            { _id: teacher._id },
            {
              $push: { courses: course._id },
            }
          );
        }
      })
    );

    return res.status(200).json({ message: "All requests accepted" });
  } catch (error) {
    console.log("error in acceptAllJoinRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//v
export const getAllTeachersInCourse = async (req, res) => {
  const userId = req.user._id; // professor id
  const { id: courseId } = req.params;

  try {
    const professor = await userModel.findById(userId);
    if (!professor)
      return res.status(404).json({ message: "professor not found" });
    if (professor.role === "Student" || professor.role === "Teacher")
      return res
        .status(403)
        .json({ message: "Unauthorized - You are not an instructor" });

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const teachers = await userModel
      .find({ _id: { $in: course.teachers } })
      .select("-password");
    return res
      .status(200)
      .json({ message: "teacher in the course", data: teachers });
  } catch (error) {
    console.log("error in getAllTeachersInCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO:
export const getAllStudentsInCourse = async (req, res) => {
  const userId = req.user._id; // professor id
  const { id: courseId } = req.params;

  try {
    const professor = await userModel.findById(userId);
    if (!professor)
      return res.status(404).json({ message: "professor not found" });
    if (professor.role === "Student" || professor.role === "Teacher")
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
  } catch (error) {
    console.log("error in getAllStudentsInCourse controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
