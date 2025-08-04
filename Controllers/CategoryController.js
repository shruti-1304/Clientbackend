const { sendResponse } = require("../Helper/ResponseHelper")
const Category = require("../Models/Category")
const validate = require("../Helper/ValidationHelper");
module.exports = {
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const validationRule = {
                name: "required|string",
            }
            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }

            const existing = await Category.findOne({ name });
            if (existing) {
                return sendResponse(res, {}, "Category already exists", 401);
            }

            const newCategory = new Category({ name });
            await newCategory.save();

            return sendResponse(res, newCategory, "Category created", 200);
        } catch (error) {
            console.error("Create Category Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
                return sendResponse(res, {}, "Category not found", 404);
            }
            return sendResponse(res, category, "Category deleted", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }

    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
             const validationRule = {
                name: "required|string",
            }
            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                { name },
                { new: true, runValidators: true }
            );
            if (!category) {
                return sendResponse(res, {}, "Category not found", 404);
            }
            return sendResponse(res, category, "Category updated", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    getCategory: async (req, res) => {
      try {
            const categories = await Category.find().sort({ createdAt: -1 });
            return sendResponse(res, categories, "Categories fetched successfully", 200);
        } catch (error) {
            console.error("Get Categories Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    
    }

}