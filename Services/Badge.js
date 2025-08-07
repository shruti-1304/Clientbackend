// seed/badgeCriteriaSeeder.js
const mongoose = require("mongoose");
const BadgeCriteria = require("../Models/BadgeCriteria");

const seedBadgeCriteria = async () => {
  const defaultCategories = [
    "contact",
    "friends",
    "eventAttended",
    "eventOrganized",
    "custom"
  ];

  for (const category of defaultCategories) {
    const exists = await BadgeCriteria.findOne({ category });
    if (!exists) {
      await BadgeCriteria.create({
        category,
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
        diamond: 0,
      });
      console.log(`Seeded badge criteria for category: ${category}`);
    }
  }

  console.log("Badge criteria seeding complete.");
};

module.exports = seedBadgeCriteria;
