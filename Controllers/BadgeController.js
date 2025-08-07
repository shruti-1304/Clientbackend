const BadgeCriteria = require("../Models/BadgeCriteria");
const { sendResponse } = require("../Helper/ResponseHelper");
const MESSAGE = require("../Constant/messages");

// Valid categories (from your enum)
const VALID_CATEGORIES = ["contact", "friends", "eventAttended", "eventOrganized"];

// GET badge criteria by category
const getBadgeCriteriaByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!VALID_CATEGORIES.includes(category)) {
      return sendResponse(res, {}, MESSAGE.BADGE.INVALID_CATEGORY, 400);
    }

    const data = await BadgeCriteria.findOne({ category });
    if (!data) {
      return sendResponse(res, {}, MESSAGE.BADGE.CATEGORY_NOT_FOUND, 404);
    }

    return sendResponse(res, { badgeCriteria: data }, MESSAGE.BADGE.FETCH_SUCCESS, 200);
  } catch (error) {
    console.error("Error fetching badge by category:", error.message);
    return sendResponse(res, {}, "internal server error", 500);
  }
};

// UPDATE badge criteria by category
const updateBadgeCriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { bronze, silver, gold, platinum, diamond } = req.body;

    console.log("id of the category", id)

    // Prepare only defined fields
    const updateFields = Object.fromEntries(
      Object.entries({ bronze, silver, gold, platinum, diamond }).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(updateFields).length === 0) {
      return sendResponse(res, {}, "No valid fields to update", 400);
    }

    const updated = await BadgeCriteria.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendResponse(res, {}, "Badge category not found", 404);
    }

    return sendResponse(res, { badgeCriteria: updated }, "Updated successfully", 200);
  } catch (error) {
    console.error("Error updating badge by ID:", error.message);
    return sendResponse(res, {}, "Internal server error", 500);
  }
};

module.exports = {
  getBadgeCriteriaByCategory,
  updateBadgeCriteria,
};
