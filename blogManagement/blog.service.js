import { Blog } from "./blog.modal.js";
import {
  addBlogValidationSchema,
  paginationValidationSchema,
} from "./blog.validation.js";

import mongoose from "mongoose";

// ===============  add task list =====================
export const createBlog = async (req, res) => {
  const newTask = req.body;

  // Validate with Joi BEFORE adding author
  try {
    await addBlogValidationSchema.validateAsync(newTask);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  // Assign logged-in user as author AFTER validation
  newTask.author = req.userInfo._id;

  try {
    await Blog.create(newTask);
    return res.status(201).send({ message: "Blog is created successfully." });
  } catch (err) {
    return res.status(500).send({ message: "Failed to create blog.", error: err.message });
  }
};


// retrieve all the task============================================
export const getAllBlog = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt"; // default sort by createdAt
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // asc or desc
    const status = req.query.status; // optional filter
    const searchText = req.query.searchText || "";

    const skip = (page - 1) * limit;

    // Build match query
    let match = {
      userId: req.userInfo._id,
    };

    if (searchText) {
      match.title = { $regex: searchText, $options: "i" };
    }

    if (status) {
      match.status = status;
    }

    // Fetch tasks
    const tasks = await Blog.aggregate([
      { $match: match },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          title: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    // Total count
    const totalMatchingTasks = await Blog.countDocuments(match);
    const totalPage = Math.ceil(totalMatchingTasks / limit);

    return res.status(200).send({ tasks, totalPage });
  } catch (error) {
    console.error("Error in getAllBlog:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};


//==================== delete a task item ==================================
export const deleteBlog = async (req, res) => {
  // extract id from params
  const taskId = req.params.id;

  // validate id for mongo id validity
  const isValidMongoId = mongoose.Types.ObjectId.isValid(taskId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "invalid mongo id" });
  }

  // find task item
  const task = await Blog.findOne({ _id: taskId });
  if (!task) {
    return res.status(404).send({ message: "Todo doesnt exists." });
  }

  // check for task owernship
  // userInfo id must match with task's userId
  const isOwnerOfTodo = task.userId === req._id;
  if (isOwnerOfTodo) {
    return res.status(403).send({ message: "it isnot belong to you.." });
  }

  //delete task
  await Blog.deleteOne({ _id: taskId });
  return res.status(200).send("deleted successfull..");
};

//================     edit a task item    =====================
export const updateBlog = async (req, res) => {

  const taskId = req.params.id;
  const newValues = req.body;

  //validate id from mongoid validity
  const isValidMongoId = mongoose.Types.ObjectId.isValid(taskId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongoId.." });
  }

  //validate newvalues from req.body
  try {
    await addBlogValidationSchema.validateAsync(newValues);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }

  //check for task existence using productId
  const task = await Blog.findOne({ _id: taskId });
  if (!task) {
    return res.status(400).send({ message: "Blog not exist.." });
  }

  //check if userinfo is owner of task
  const isOwnerOfProduct = task.userId === req._id;
  if (isOwnerOfProduct) {
    return res.status(403).send({ message: "You arenot owner of this task." });
  }

  //update task
  await Blog.updateOne({ _id: taskId }, newValues);
  return res.status(200).send({ message: "the task is successfully edited.." });
};

//===============  get the task details =============================
export const getBlogDetail = async (req, res) => {
  const taskId = req.params.id;
  const isValidMongoId = mongoose.Types.ObjectId.isValid(taskId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongoId..." });
  }
  const task = await Blog.findById(taskId);
  if (!task) {
    return res.status(404).send({ message: "Product doesnot exists.." });
  }
  return res.status(200).send(task);
};




// update only the task status

export const updateBlogStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["pending", "in-progress", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const updatedTask = await Blog.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json({
      message: "Blog status updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};