const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  access: { 
    type: [String],  // Changed from String to an array of strings
    enum: ['CreateOrder', 'Printing', 'Cutting/Pasting', 'Dispatch', 'All'],  // Enum for allowed roles
    required: true 
  },
  admin: { type: Boolean, default: false }
}, { timestamps: true });  // Enables createdAt and updatedAt fields automatically

module.exports = mongoose.model('User', userSchema);