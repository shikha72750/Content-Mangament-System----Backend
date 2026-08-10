import { userModel } from "../model/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await userModel.findOne({ email });
        if (data) {
            return res.json({
                success: false,
                code: 400,
                message: "User already exists",
                data: data,
                error: true
            })
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const data = new userModel({ name, email, password: hashedPassword });
            const result = await data.save();
            res.json({
                success: true,
                code: 200,
                message: "User registration successfull",
                data: result,
                error: false
            })
        }

    }
    catch (err) {
        res.json({
            success: false,
            code: 500,
            message: "registration failed",
            data: [],
            error: true
        })

    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                code: 400,
                message: "User not found",
                data: [],
                error: true
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
                data: [],
                error: true
            });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            token: token,
            error: false
        });
    }
    catch (err) {
        console.log(err);

        res.json({
            success: false,
            code: 500,
            message: "Internal server error",
            data: [],
            error: true
        })

    }
}

export const profileController = async (req, res) => {
    try {
        res.json({
            success: true,
            code: 200,
            message: "Profile fetched successfully",
            data: req.user,
            error: false
        });
    } catch (err) {
        res.json({
            success: false,
            code: 500,
            message: "Internal server error",
            data: "",
            error: true
        });
    }
}