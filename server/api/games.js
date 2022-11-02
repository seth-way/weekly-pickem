const router = require('express').Router();
const { Game, Pick, Player } = require('../db');

// get /api/picks
router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll();
    const pendingGames = [];
    const completedGames = [];

    for (const game of games) {
      if (game.winner) {
        completedGames.push(game);
      } else {
        pendingGames.push(game);
      }
    }

    res.json({ completedGames, pendingGames });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
