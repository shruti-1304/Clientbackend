// Controllers/SubCategoryController.js

const SubCategory = require("../Models/SubCategory");
const Category = require("../Models/Category");
const { sendResponse } = require("../Helper/ResponseHelper");
const validate = require("../Helper/ValidationHelper");

module.exports = {
    addSubCategory: async (req, res) => {
        try {
            const { name, categoryId } = req.body;


            const validationRule = {
                name: "required|string",
                categoryId: 'required'
            }
            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }

            const category = await Category.findById(categoryId);
            if (!category) {
                return sendResponse(res, {}, "Parent Category not found", 404);
            }



            const existing = await SubCategory.findOne({ name, categoryId });
            if (existing) {
                return sendResponse(res, {}, "SubCategory already exists", 409);
            }

            const subCategory = new SubCategory({ name, categoryId });
            await subCategory.save();

            return sendResponse(res, subCategory, "SubCategory created successfully", 201);
        } catch (error) {
            console.error("Add SubCategory Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    getSubCategoriesByCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;

            const subCategories = await SubCategory.find({ categoryId }).sort({ createdAt: -1 });

            return sendResponse(res, subCategories, "SubCategories fetched", 200);
        } catch (error) {
            console.error("Get SubCategories Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    deleteSubCategory: async (req, res) => {
        try {
            const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
            if (!subCategory) {
                return sendResponse(res, {}, "SubCategory not found", 404);
            }
            return sendResponse(res, subCategory, "SubCategory deleted", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    updateSubCategory: async (req, res) => {
        try {


            const validationRule = {
                name: "required|string"
            }
            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }

            const { name } = req.body;

            const updated = await SubCategory.findByIdAndUpdate(
                req.params.id,
                { name },
                { new: true, runValidators: true }
            );

            if (!updated) {
                return sendResponse(res, {}, "SubCategory not found", 404);
            }

            return sendResponse(res, updated, "SubCategory updated", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }
    },
};
