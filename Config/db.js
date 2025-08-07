const mongoose = require("mongoose")
require('dotenv').config();
const server = process.env.DB_SERVER
const dbport = process.env.DB_PORT
const database = process.env.DB_NAME
const seedBadgeCriteria = require("../Services/Badge");
const MONGO_URI = `mongodb://${server}:${dbport}/${database}`
 
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
    //   auth: {
    //     username,
    //     password,
    //   }
    
    })
 
    console.log(`MongoDB connected: ${MONGO_URI}`)
    await seedBadgeCriteria();
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1) // Exit process with failure
  }
}
 
module.exports = connectDB