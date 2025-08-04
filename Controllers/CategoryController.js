const { sendResponse } = require("../Helper/ResponseHelper")
const Category = require("../Models/Category")
module.exports = {
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return sendResponse(res, {}, "Category name is required", 400);
            }

            const existing = await Category.findOne({ name });
            if (existing) {
                return sendResponse(res, {}, "Category already exists", 409);
            }

            const newCategory = new Category({ name });
            await newCategory.save();

            return sendResponse(res, newCategory, "Category created", 201);
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
    updateCategory :async(req, res)=>{
       try {
      const { name } = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name},
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

    getCategory: async (req, res)=>{
        
    }

}