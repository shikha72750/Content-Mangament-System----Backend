import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },

        media: [
            {
                url: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    enum: ["image", "video"],
                    required: true,
                },
            },
        ],

        category: {
            type: String,
            required: true,
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],

        comments: [commentSchema],

        views: {
            type: Number,
            default: 0,
        },

        shareCount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "Draft",
        },
    },
    {
        timestamps: true,
    }
);

export const blogModel = mongoose.model("Blog", blogSchema);