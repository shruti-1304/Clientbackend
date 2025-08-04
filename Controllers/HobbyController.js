const Hobby = require("../Models/Hobbies");
const SubCategory = require("../Models/SubCategory");
const Category = require("../Models/Category");
const { sendResponse } = require("../Helper/ResponseHelper");
const validate = require("../Helper/ValidationHelper");

module.exports = {
    addHobby: async (req, res) => {
        try {
            const { name, categoryId, subCategoryId } = req.body;

            const validationRule = {
                name: "required|string",
                categoryId: "required",
                subCategoryId: "required"
            };

            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }

            // Check category exists
            const category = await Category.findById(categoryId);
            if (!category) {
                return sendResponse(res, {}, "Category not found", 404);
            }

            // Check subcategory exists and belongs to the given category
            const subCategory = await SubCategory.findOne({
                _id: subCategoryId,
                categoryId: categoryId
            });
            if (!subCategory) {
                return sendResponse(res, {}, "SubCategory not found in the given category", 404);
            }

            // Prevent duplicate hobby in same subcategory
            const existing = await Hobby.findOne({ name, subCategoryId });
            if (existing) {
                return sendResponse(res, {}, "Hobby already exists in this subcategory", 409);
            }

            const hobby = new Hobby({ name, categoryId, subCategoryId });
            await hobby.save();

            return sendResponse(res, hobby, "Hobby added successfully", 201);
        } catch (error) {
            console.error("Add Hobby Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    getHobbiesBySubCategory: async (req, res) => {
        try {
            const { subCategoryId } = req.params;

            const hobbies = await Hobby.find({ subCategoryId }).sort({ createdAt: -1 });

            return sendResponse(res, hobbies, "Hobbies fetched", 200);
        } catch (error) {
            console.error("Get Hobbies Error:", error);
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    deleteHobby: async (req, res) => {
        try {
            const hobby = await Hobby.findByIdAndDelete(req.params.id);
            if (!hobby) {
                return sendResponse(res, {}, "Hobby not found", 404);
            }
            return sendResponse(res, hobby, "Hobby deleted", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }
    },

    updateHobby: async (req, res) => {
        try {
            const { name, categoryId, subCategoryId } = req.body;

            const validationRule = {
                name: "required|string",
                categoryId: "required",
                subCategoryId: "required"
            };
            const error = await validate(req.body, validationRule);
            if (error) {
                return sendResponse(res, {}, error, 422);
            }

            // Validate category and subcategory relation
            const subCategory = await SubCategory.findOne({
                _id: subCategoryId,
                categoryId: categoryId
            });

            if (!subCategory) {
                return sendResponse(res, {}, "SubCategory does not belong to the given Category", 400);
            }

            const updated = await Hobby.findByIdAndUpdate(
                req.params.id,
                { name, categoryId, subCategoryId },
                { new: true, runValidators: true }
            );

            if (!updated) {
                return sendResponse(res, {}, "Hobby not found", 404);
            }

            return sendResponse(res, updated, "Hobby updated", 200);
        } catch (error) {
            return sendResponse(res, {}, "Server error", 500);
        }
    },
};
