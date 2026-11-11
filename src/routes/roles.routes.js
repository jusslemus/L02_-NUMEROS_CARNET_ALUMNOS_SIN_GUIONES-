const router = require('express').Router();
const c = require('../controllers/roles.controller');

router.get('/', c.getAll);

module.exports = router;
