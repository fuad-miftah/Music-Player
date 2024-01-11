import express from "express";
import { login, register, getUser } from "../controllers/auth.controller.js";
import { createSuccess } from "../utils/success.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/user/:id", verifyToken, getUser)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", (req, res) => {
    // create a success response
    res.clearCookie("access_token").send(createSuccess("Logged out successfully."));

})

export default router