import express from "express";
import { activation, editUser, fetchUser, forgotPassword, login, register, resetPassword, timeSlotUpdate, validatePassword } from "../Controllers/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router()

router.post("/register",register)
router.post('/activate_registration', activation)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/validatePassword', validatePassword)
router.post('/resetPassword', resetPassword)
router.post('/fetchUser',fetchUser)
router.post('/updateTimeslots', authMiddleware, timeSlotUpdate)
router.post('/editUser', authMiddleware, editUser)
export default router