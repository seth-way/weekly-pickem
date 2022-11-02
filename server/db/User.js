const { STRING, BOOLEAN } = require('sequelize');
const db = require('./db');

module.exports = db.define('user', {
  name: {
    type: STRING,
    allowNull: false,
  },
  admin: {
    type: BOOLEAN,
  },
});
