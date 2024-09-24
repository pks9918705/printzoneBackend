const Party = require('../models/Party');

// Create a new party
exports.createParty = async (req, res) => {
  console.log("party reg k liye aya hai")
  console.log(req.body)
  try {
    const newParty = new Party(req.body);
    const savedParty = await newParty.save();
    res.status(201).json(savedParty);
  } catch (error) {
    res.status(500).json({ message: 'Error creating party', error });
    console.log("err in creating party",error)
  }
};

// Get all parties
exports.getAllParties = async (req, res) => {
  try {
    const parties = await Party.find().populate('orderId');
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parties', error });
  }
};

// Get a specific party by ID
exports.getPartyById = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id).populate('orderId');
    if (!party) return res.status(404).json({ message: 'Party not found' });
    res.status(200).json(party);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party', error });
  }
};

// Get a specific party by phone number or email address
exports.getPartyByPhoneOrEmail = async (req, res) => {
  try {
    const { phone, email } = req.query;  // Retrieve phone and email from query parameters

    // Construct a query object based on the provided parameters
    let query = {};
    if (phone) query.phone = phone;
    if (email) query.email = email;

    const party = await Party.findOne(query).populate('orderId');  // Use findOne to get a single document matching the query

    if (!party) return res.status(404).json({ message: 'Party not found' });

    res.status(200).json(party);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party', error });
  }
};

// Update a party
exports.updateParty = async (req, res) => {
  try {
    const updatedParty = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedParty) return res.status(404).json({ message: 'Party not found' });
    res.status(200).json(updatedParty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating party', error });
  }
};

// Delete a party
exports.deleteParty = async (req, res) => {
  try {
    const deletedParty = await Party.findByIdAndDelete(req.params.id);
    if (!deletedParty) return res.status(404).json({ message: 'Party not found' });
    res.status(200).json({ message: 'Party deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting party', error });
  }
};
