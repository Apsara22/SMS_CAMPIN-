// models/Campaign.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Paused', 'Completed', 'Draft'),
    defaultValue: 'Draft'
  },
  total_sms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sent_sms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  responses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_activity: {
    type: DataTypes.DATE,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  form_fields: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'campaigns',
  timestamps: false,
  underscored: true
});

module.exports = Campaign;