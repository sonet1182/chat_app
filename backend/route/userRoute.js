import express from 'express';
import isLogin from '../middleware/isLogin.js';
import { getCurrentChatters, getUserBySearch } from '../routeController/userHandlerController.js';

const router = express.Router();

router.get('/search', isLogin, getUserBySearch);
router.get('/current_chatters', isLogin, getCurrentChatters);

export default router;