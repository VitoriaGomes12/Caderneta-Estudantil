const router = require('express').Router();
const c = require('../controllers/ocorrenciaController');

router.get('/estudantes/:estudanteId/ocorrencias', c.listar);
router.post('/estudantes/:estudanteId/ocorrencias', c.criar);
router.get('/ocorrencias/:id', c.buscar);
router.put('/ocorrencias/:id', c.atualizar);
router.delete('/ocorrencias/:id', c.apagar);

module.exports = router;