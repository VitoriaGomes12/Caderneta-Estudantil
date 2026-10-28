const router = require('express').Router();
const c = require('../controllers/sistemaController');

router.get('/painel', c.painel);
router.get('/backup', c.backup);

module.exports = router;