import express from "express";
import jwt from "jsonwebtoken";
import { loginController, profileController, registerController } from "../controller/authController.js";

const router = express.Router();

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.json({
            success: false,
            code: 404,
            message: "Token is required",
            data: "",
            error: true
        })
    }

    const rawToken = req?.headers?.authorization?.split(" ");
    const token = rawToken[1];

    jwt.verify(token, "jwt_secret", (err, decode) => {
        if (err) {
            return res.json({
                success: false,
                code: 400,
                message: "Invalid or token expired",
                data: "",
                error: true
            })
        } else {
            req.user = decode;
            next();
        }
    })
}

router.post("/register", registerController)
router.post("/login", loginController)
router.get("/profile", authMiddleware, profileController)

export default router;            