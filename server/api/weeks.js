const router = require('express').Router();
const { Op } = require('sequelize');
const { Game, Pick, User } = require('../db');

// get /api/weeks/:week
router.get('/:week', async (req, res, next) => {
  try {
    const { week } = req.params;
    let games = await Game.findAll({ where: { week: week } });
    const picks = await Pick.findAll({
      include: [Game, User],
      where: { '$game.week$': { [Op.eq]: week } },
    });
    // create object where key is all userId, and val is user name
    const users = picks.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.userId]: { name: curr.user.name, correct: 0, incorrect: 0 },
      }),
      {}
    );

    // add picks object to each game
    games = games.map(game => ({ ...game.dataValues, picks: {} }));
    // convert games array to obj
    games = games.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {});

    picks.forEach(pick => {
      games[pick.gameId].picks[pick.userId] = pick.choice;
      if (pick.success === 'win') {
        users[pick.userId].correct += 1;
      } else if (pick.success === 'loss') {
        users[pick.userId].incorrect += 1;
      }
      if (pick.tiebreaker) {
        users[pick.userId].tbHome = pick.homePts;
        users[pick.userId].tbAway = pick.awayPts;
      }
    });

    res.json({ games, users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
