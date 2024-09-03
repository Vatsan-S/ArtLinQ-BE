import express from "express";
import { createService, deleteService, editService, getAllServices, getService, getServiceCategory } from "../Controllers/serviceController.js";
import authMiddleware from '../Middleware/authMiddleware.js'


const router = express.Router()

router.post('/createService', createService)
router.get('/getAllData', getAllServices)
router.post('/getService', getService)
router.post('/getServiceCategory', getServiceCategory)
router.post('/editService', authMiddleware, editService)
router.post('/deleteService', authMiddleware, deleteService)
export default router