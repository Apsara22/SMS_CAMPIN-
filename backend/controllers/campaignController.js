// controllers/campaignController.js
const Campaign = require('../models/Campaign');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { name, description, form_fields, total_sms } = req.body;
    const campaign = await Campaign.create({
      name,
      description,
      form_fields,
      total_sms: total_sms || 0,
      status: 'Draft',
      created_at: new Date(),
      updated_at: new Date()
    });
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      attributes: [
        'id',
        'name',
        'status',
        'total_sms',
        'sent_sms',
        'responses',
        'last_activity',
        'created_at'
      ],
      order: [['last_activity', 'DESC']]
    });
    
    // Format the response to match frontend needs
    const formattedCampaigns = campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      sentSMS: `${campaign.sent_sms}/${campaign.total_sms}`,
      responses: `${campaign.responses} (${campaign.total_sms > 0 ? Math.round((campaign.responses / campaign.sent_sms) * 100) : 0}%)`,
      lastActivity: campaign.last_activity || campaign.created_at
    }));
    
    res.json(formattedCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// Update campaign status
exports.updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    campaign.status = status;
    campaign.updated_at = new Date();
    await campaign.save();
    
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign status:', error);
    res.status(500).json({ error: 'Failed to update campaign status' });
  }
};

// Update SMS counters
exports.updateSMSCounters = async (req, res) => {
  try {
    const { id } = req.params;
    const { sent, responses } = req.body;
    
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    if (sent) campaign.sent_sms = sent;
    if (responses) campaign.responses = responses;
    campaign.last_activity = new Date();
    campaign.updated_at = new Date();
    await campaign.save();
    
    res.json(campaign);
  } catch (error) {
    console.error('Error updating SMS counters:', error);
    res.status(500).json({ error: 'Failed to update SMS counters' });
  }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Campaign.destroy({
      where: { id }
    });
    
    if (deleted) {
      return res.status(204).send();
    }
    
    throw new Error('Campaign not found');
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};