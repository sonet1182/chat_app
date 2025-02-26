import express from 'express';
import { userRegister, userLogin, userLogOut } from '../routeController/userRouteController.js';

const router = express.Router();

router.post("/register", userRegister);  // register a user
router.post("/login", userLogin);  // register a user
router.post("/logout", userLogOut);  // register a user

export default router;  // export the router