const { INTEGER, ARRAY } = require('sequelize');
const db = require('./db');

module.exports = db.define('result', {
  week: {
    type: INTEGER,
    allowNull: false,
  },
  winners: {
    type: ARRAY(INTEGER),
    allowNull: false,
  },
  losers: {
    type: ARRAY(INTEGER),
    allowNull: false,
  },
});
