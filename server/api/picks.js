const router = require('express').Router();
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

module.exports = router;
