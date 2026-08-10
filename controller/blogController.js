import { blogModel } from "../model/blog.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";

// helper: purani local image delete karo (Cloudinary URL ho to skip)
const deleteLocalImage = (imagePath) => {
    if (!imagePath || imagePath.startsWith("http")) return;
    const filePath = path.join(process.cwd(), imagePath); // e.g. /uploads/blogs/xxx.png
    fs.unlink(filePath, (err) => {
        if (err) console.log("Old image not deleted:", err.message);
    });
};

export const createBlogController = async (req, res) => {
    try {
        const { title, description, category, tags, status } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const blog = await blogModel.create({
            title,
            slug: slugify(title, { lower: true, strict: true }),
            description,
            category,
            tags,
            image: req.file ? `/uploads/blogs/${req.file.filename}` : "",
            author: req.user.id,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel
            .find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: true
        });
    }
};

export const getSingleBlogController = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await blogModel
            .findOne({ slug })
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                error: true
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: true
        });
    }
};

// NEW: id se blog fetch karo (edit form pre-fill ke liye)
export const getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await blogModel.findById(id).populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                error: true
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: true
        });
    }
};

export const deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await blogModel.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                error: true
            });
        }

        // image file bhi delete karo agar local hai
        deleteLocalImage(blog.image);

        await blogModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: true
        });
    }
};

export const updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, tags, status } = req.body;

        const blog = await blogModel.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                error: true
            });
        }

        blog.title = title || blog.title;
        blog.slug = title
            ? slugify(title, { lower: true, strict: true })
            : blog.slug;
        blog.description = description || blog.description;
        blog.category = category || blog.category;
        blog.tags = tags || blog.tags;
        blog.status = status || blog.status;

        // naya image aaya hai to purana delete karke naya set karo
        if (req.file) {
            deleteLocalImage(blog.image);
            blog.image = `/uploads/blogs/${req.file.filename}`;
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: true
        });
    }
};