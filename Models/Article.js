// Models/Article.js

const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        media: [{
            media: { type: String },

        }
        ],
        message: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Article", articleSchema);
