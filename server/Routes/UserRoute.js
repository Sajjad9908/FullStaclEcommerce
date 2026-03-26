import express from "express";
import { changePassword, forgetPassword, getAllUsers, getUserById, login, logout, otpVerify, regester, ReVerify, UpdateUser, verify } from "../controller/UserController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { DeleteProduct } from "../controller/ProductController.js";

const router2=express.Router();


router2.post("/register",regester);
router2.post("/verify",verify);
router2.post("/reverify",ReVerify);
router2.post("/login",login);
router2.post("/logout",isAuthenticated,logout);
router2.post("/forget-password",forgetPassword)
router2.post('/verify-otp/:email',otpVerify);
router2.post('/changePassword/:email',changePassword);
router2.get('/allUsers',isAuthenticated,isAdmin,getAllUsers);
router2.get('/getUser/:userId',getUserById);
router2.put('/update/:id',isAuthenticated,singleUpload,UpdateUser)


export default router2;


