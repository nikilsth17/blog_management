import express from "express";
import { createBlog, deleteBlog, getAllBlog, getBlogDetail, updateBlog, updateBlogStatus } from "./blog.service.js";
import { isUser } from "../auth/auth.middleware.js";

const router= express.Router();


//create a task
router.post("/api/blog",isUser,createBlog);


//retrieve all task
router.get("/api/blog",isUser,getAllBlog);

//retrieve the task's detail by id
router.get("/api/blog/:id",isUser,getBlogDetail);


//update a task
router.put("/api/blog/:id",updateBlog);

//delete a task
router.delete("/api/blog/:id",deleteBlog);


// update only task status
router.patch("/api/blog/:id/status", updateBlogStatus);


export default router;