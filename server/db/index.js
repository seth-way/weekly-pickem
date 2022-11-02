const db = require('./db');

const Game = require('./Game');
const Pick = require('./Pick');
const User = require('./User');

Pick.belongsTo(Game);
Game.hasMany(Pick);

Pick.belongsTo(User);
User.hasMany(Pick);

module.exports = {
  db,
  Game,
  Pick,
  User,
};
