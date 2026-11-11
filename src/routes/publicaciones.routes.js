const router = require('express').Router();
const c = require('../controllers/publicaciones.controller');
const { validateId, validateBody } = require('../middlewares/validate');

const reglas = {
  titulo: { type: 'string', required: true, max: 150 },
  descripcion: { type: 'string', required: false, max: 1000 },
  usuarioId: { type: 'integer', required: true },
};

// consultas especificas antes de id
router.get('/usuario/:usuarioId', validateId('usuarioId'), c.getByUsuario);
router.get('/top/:n', validateId('n'), c.getTop);

// CRUD
router.get('/', c.getAll);
router.get('/:id', validateId('id'), c.getById);
router.post('/', validateBody(reglas), c.create);
router.put('/:id', validateId('id'), validateBody(reglas), c.update);
router.delete('/:id', validateId('id'), c.remove);

module.exports = router;
