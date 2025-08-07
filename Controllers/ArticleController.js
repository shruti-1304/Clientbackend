// Controllers/ArticleController.js

const Article = require("../Models/Article");
const { sendResponse } = require("../Helper/ResponseHelper");
const { uploadFile } = require("../Helper/FileUploadHelper"); // assuming you already have this
const validate = require("../Helper/ValidationHelper");
module.exports = {
    addArticle: async (req, res) => {
        try {
            const { name, message } = req.body;
            const validationRule = {
                name: "required|string",
                message: "required|string"
            }
            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }

            const files = Array.isArray(req.files?.media)
                ? req.files.media
                : req.files?.media
                    ? [req.files.media]
                    : [];

            let uploadedPaths = [];

            for (let file of files) {
                const uploadedPath = await uploadFile(file);
                uploadedPaths.push({ media: uploadedPath });
            }

            const article = new Article({
                name,
                message,
                media: uploadedPaths,
            });

            await article.save();

            return sendResponse(res, article, "Article created", 200);
        } catch (error) {
            
            return sendResponse(res, {}, "Server error", 500);
        }
    },
    //get the list of the articles present 
    getArticles: async (req, res) => {
        try {
            // Get page and limit from query parameters (default: page=1, limit=10)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Calculate how many documents to skip
            const skip = (page - 1) * limit;

            // Fetch total count for pagination info
            const totalCount = await Article.countDocuments();

            // Fetch paginated articles, sorted by latest
            const articles = await Article.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            // Send paginated response
            return sendResponse(res, {
                articles,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount
            }, "Articles fetched", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }

    },
    //updating the article 
    updateArticle: async (req, res) => {
        try {
            const articleId = req.params.id;
            const { name, message, mediaToDelete } = req.body;

            const article = await Article.findById(articleId);
            if (!article) {
                return sendResponse(res, {}, "Article not found", 404);
            }

            // Optional field updates
            if (name) article.name = name;
            if (message) article.message = message;

            console.log("Media to delete:", mediaToDelete);
            console.log("Existing media:", article.media.map((m) => m._id?.toString?.() || m));

            //Handle media deletion
            if (Array.isArray(mediaToDelete) && mediaToDelete.length > 0) {
                article.media = article.media.filter(
                    (item) => !mediaToDelete.includes(item._id?.toString?.() || item)
                );
            }

            // Handle new media uploads
            const newMediaFiles = Array.isArray(req.files?.media)
                ? req.files.media
                : req.files?.media
                    ? [req.files.media]
                    : [];

            if (newMediaFiles.length > 0) {
                for (const file of newMediaFiles) {
                    const uploadedPath = await uploadFile(file);
                    article.media.push({ media: uploadedPath });
                }
            }

            await article.save();

            return sendResponse(res, article, "Article updated successfully", 200);
        } catch (error) {
            console.error("Update Article Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    },
    //
    deleteArticle: async (req, res) => {
        try {
            const article = await Article.findByIdAndDelete(req.params.id);
            if (!article) {
                return sendResponse(res, {}, "Article not found", 422);
            }

            return sendResponse(res, article, "Article deleted", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }
    },
    toggleArticleStatus: async (req, res) => {
        try {
            const articleId = req.params.id;



            const article = await Article.findById(articleId);
            if (!article) {
                return sendResponse(res, {}, "Article not found", 404);
            }

            // Toggle status: true => false, false => true
            article.status = !article.status;

            await article.save();

            return sendResponse(res, article, `Article ${article.status ? "activated" : "deactivated"} successfully`, 200);
        } catch (error) {
            console.error("Toggle Status Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    }

};
