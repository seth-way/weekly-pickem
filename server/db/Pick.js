const { ENUM, BOOLEAN, INTEGER } = require('sequelize');
const db = require('./db');
const teams = require('../../bin/teams');

module.exports = db.define('pick', {
  choice: {
    type: ENUM(...teams),
    allowNull: false,
  },
  success: {
    type: ENUM('win', 'loss'),
  },
  tiebreaker: {
    type: BOOLEAN,
  },
  homePts: {
    type: INTEGER,
  },
  awayPts: {
    type: INTEGER,
  },
});
