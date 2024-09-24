const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyController');

// Routes for parties
router.post('/', partyController.createParty);
router.get('/', partyController.getAllParties);
router.get('/:id', partyController.getPartyById);
router.put('/:id', partyController.updateParty);
router.delete('/:id', partyController.deleteParty);

module.exports = router;
