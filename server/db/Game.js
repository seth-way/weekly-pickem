const { INTEGER, DATE, ENUM, FLOAT } = require('sequelize');
const db = require('./db');
const teams = require('../../bin/teams');

module.exports = db.define('game', {
  away: {
    type: ENUM(...teams),
    allowNull: false,
  },
  home: {
    type: ENUM(...teams),
    allowNull: false,
  },
  spread: {
    type: FLOAT,
    allowNull: false,
  },
  start: {
    type: DATE,
    allowNull: false,
  },
  week: {
    type: INTEGER,
    allowNull: false,
  },
  awayPts: {
    type: INTEGER,
  },
  homePts: {
    type: INTEGER,
  },
  winner: {
    type: ENUM(...teams),
  },
});
