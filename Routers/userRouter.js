import express from "express";
import { activation, forgotPassword, login, register, resetPassword, validatePassword } from "../Controllers/userController.js";

const router = express.Router()

router.post("/register",register)
router.post('/activate_registration', activation)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/validatePassword', validatePassword)
router.post('/resetPassword', resetPassword)
export default router