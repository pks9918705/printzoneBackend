const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the Party schema
const PartySchema = new Schema({
  Name: { type: String, required: true },
  GSTN: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  orderId: [{ type: Schema.Types.ObjectId, ref: 'Order' }],  // Reference to Order schema
}, { timestamps: true });  // Adding timestamps for createdAt and updatedAt

// Create and export the Party model
const Party = model('Party', PartySchema);
module.exports = Party;
