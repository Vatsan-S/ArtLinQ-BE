import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { createAppoinment, fetchBookedDates } from "../Controllers/appoinmentController.js";


const router = express.Router()

router.post('/createAppoinment', authMiddleware, createAppoinment)
router.post('/fetchAllAppoinments',authMiddleware, fetchBookedDates)

export default router