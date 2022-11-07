const router = require('express').Router();
const { Game, Pick, Player } = require('../db');

// put /api/games/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);

    Object.entries(req.body).forEach(([key, value]) => {
      game[key] = value;
    });

    if (req.body.awayPts && req.body.homePts) {
      if (req.body.awayPts + game.spread > req.body.homePts) {
        game.winner = game.away;
      }

      if (req.body.awayPts + game.spread < req.body.homePts) {
        game.winner = game.home;
      }
    }

    await game.save();

    res.status(201).send(game);
  } catch (err) {
    next(err);
  }
});

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
