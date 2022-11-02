const router = require('express').Router();
const { User } = require('../db');

router.get(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
