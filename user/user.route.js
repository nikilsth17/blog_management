import express from "express";
import { loginUser, registerUser } from "./user.service.js";

const router= express.Router();


//register users
router.post("/api/user/register",registerUser);

//login user
router.post("/api/user/login",loginUser);


export default router;