const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  lengthWidthHeight: {
    type: [String],  // Array of strings for length, width, and height
    required: true
  },
  paperGSM: {
    type: String,
    required: true
  },
  jobQuality: {
    type: String,
    required: true
  },
  amountDetails: {
    type: String,
    required: true
  },
  partyId: {
    type: Schema.Types.ObjectId,
    ref: 'Party',  // Reference to the Party schema
    required: true
  },
  status: { 
    type: String, 
    enum: ['Created', 'Printed', 'Cutting/Pasting', 'Dispatch'], // Updated status values
    default: 'Created'  // Default status when an order is created
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
