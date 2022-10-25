const db = require('./db');

const Game = require('./Game');
const Pick = require('./Pick');
const Player = require('./Player');

Pick.belongsTo(Game);
Game.hasMany(Pick);

Pick.belongsTo(Player);
Player.hasMany(Pick);

module.exports = {
  db,
  Game,
  Pick,
  Player,
};
