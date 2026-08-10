import express from "express";
import { upload } from "../middleware/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createBlogController,
    getAllBlogsController,
    getSingleBlogController,
    getBlogByIdController,
    updateBlogController,
    deleteBlogController
} from "../controller/blogController.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), createBlogController);
router.get("/all", getAllBlogsController);
router.get("/single/:slug", getSingleBlogController);
router.get("/id/:id", getBlogByIdController);
router.put("/update/:id", authMiddleware, upload.single("image"), updateBlogController);
router.delete("/delete/:id", authMiddleware, deleteBlogController);

export default router;