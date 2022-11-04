const router = require('express').Router();
const { Game, Pick, Player } = require('../db');

// get /api/games
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

// post /api/games
router.post('/', async (req, res, next) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(201).send(newGame);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
