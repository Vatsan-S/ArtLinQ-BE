import express from "express";
import { createService, getAllServices } from "../Controllers/serviceController.js";


const router = express.Router()

router.post('/createService', createService)
router.get('/getAllData', getAllServices)
export default router