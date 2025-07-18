// routes/campaignRoutes.js
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.post('/campaigns', campaignController.createCampaign);
router.get('/campaigns', campaignController.getAllCampaigns);
router.put('/campaigns/:id/status', campaignController.updateCampaignStatus);
router.put('/campaigns/:id/sms', campaignController.updateSMSCounters);
router.delete('/campaigns/:id', campaignController.deleteCampaign);

module.exports = router;