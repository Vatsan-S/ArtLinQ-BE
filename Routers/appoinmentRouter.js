import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { cancelBooking, createAppoinment, fetchBookedDates, fetchTimeSlot } from "../Controllers/appoinmentController.js";


const router = express.Router()

router.post('/createAppoinment', authMiddleware, createAppoinment)
router.post('/fetchAllAppoinments',authMiddleware, fetchBookedDates)
router.post('/cancelAppointment', authMiddleware, cancelBooking)
router.post('/fetchTimeSlots', authMiddleware, fetchTimeSlot)

export default router