import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();    

//api/v1/auth/sign-up
authRouter.post('/sign-up', signUp)

//api/v1/auth/sign-in
authRouter.post('/sign-in', signIn)

//api/v1/auth/sign-out
authRouter.post('/sign-out', signOut)

export default authRouter;