import express from "express";
import { getMessages, sendMessages } from "../routeController/messageRouteController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post('/send/:id', isLogin, sendMessages);
router.get('/:id', isLogin, getMessages);

export default router;