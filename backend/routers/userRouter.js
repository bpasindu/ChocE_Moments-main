import express from 'express';
import { initiateSignup, verifySignup, initiateLogin, verifyLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', initiateSignup);
userRouter.post('/verify-signup', verifySignup);
userRouter.post('/login', initiateLogin);
userRouter.post('/verify-login', verifyLogin);



export default userRouter;