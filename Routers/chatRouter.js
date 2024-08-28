import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { accessChat, sendMessage,fetchAllChat,fetchAllMessages } from "../Controllers/chatController.js";

const router = express.Router();

router.post("/accessChat", authMiddleware, accessChat);
router.post("/sendMessage", authMiddleware, sendMessage);
router.get('/fetchAllChats', authMiddleware, fetchAllChat)
router.post('/fetchAllMessages', authMiddleware, fetchAllMessages)
export default router;
