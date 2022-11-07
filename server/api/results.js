const router = require('express').Router();
const { Result } = require('../db');

// get /api/results
router.get('/', async (req, res, next) => {
  try {
    const results = await Result.findAll();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// post /api/results
router.post('/', async (req, res, next) => {
  try {
    let updated;
    const result = req.body;
    const matching = await Result.findAll({ where: { week: result.week } });

    if (matching.length) {
      updated = matching[0];
      updated.winners = result.winners;
      updated.losers = result.losers;
      await updated.save();
    } else {
      updated = await Result.create(result);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
