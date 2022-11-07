const router = require('express').Router();

router.use('/games', require('./games'));
router.use('/picks', require('./picks'));
router.use('/users', require('./users'));
router.use('/weeks', require('./weeks'));
router.use('/results', require('./results'));

module.exports = router;
