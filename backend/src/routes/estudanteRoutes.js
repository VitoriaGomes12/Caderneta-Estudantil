const router = require('express').Router();
const c = require('../controllers/estudanteController');

router.get('/', c.listar);
router.get('/turmas', c.turmas); // tem de vir antes de '/:id'
router.get('/:id', c.buscar);
router.post('/', c.criar);
router.put('/:id', c.atualizar);
router.delete('/:id', c.apagar);

module.exports = router;