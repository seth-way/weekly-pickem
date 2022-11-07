const router = require('express').Router();
const { Op } = require('sequelize');
const { Game, Pick, User } = require('../db');

// get /api/picks
router.get('/', async (req, res, next) => {
  try {
    let picks = await Pick.findAll({ include: [Game, User] });
    const unresolvedPicks = picks.filter(pick => pick.success === null);
    let updated = false;

    for (const pick of unresolvedPicks) {
      if (pick.game.winner) {
        pick.success = pick.choice === pick.game.winner ? 'win' : 'loss';
        await pick.Save();
        updated = true;
      }
    }

    if (updated) picks = await Pick.findAll({ include: [Game, User] });

    res.json(picks);
  } catch (err) {
    next(err);
  }
});

// post /api/picks
router.post('/', async (req, res, next) => {
  try {
    const picksArray = req.body;
    await Promise.all(picksArray.map(pick => Pick.create(pick)));
    res.status(201).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// get /api/picks/:week
router.get('/:week', async (req, res, next) => {
  const { week } = req.params;
  try {
    let picks = await Pick.findAll({
      include: [Game, User],
      where: { '$game.week$': { [Op.eq]: +week } },
    });
    const unresolvedPicks = picks.filter(pick => pick.success === null);
    let updated = false;

    for (const pick of unresolvedPicks) {
      if (pick.game.winner) {
        pick.success = pick.choice === pick.game.winner ? 'win' : 'loss';
        await pick.Save();
        updated = true;
      }
    }

    if (updated)
      picks = await Pick.findAll({
        include: [Game, User],
        where: { '$game.week$': { [Op.eq]: week } },
      });

    res.json(picks);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
