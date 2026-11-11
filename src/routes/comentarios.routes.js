const router = require('express').Router();
const c = require('../controllers/comentarios.controller');
const { validateId, validateBody } = require('../middlewares/validate');

const reglas = {
  publicacionId: { type: 'integer', required: true },
  comentario: { type: 'string', required: true, max: 500 },
  usuarioId: { type: 'integer', required: true },
};

// consultas especificas
router.get('/publicacion/:publicacionId', validateId('publicacionId'), c.getByPublicacion);
router.get('/usuario/:usuarioId', validateId('usuarioId'), c.getByUsuario);

// CRUD
router.get('/', c.getAll);
router.get('/:id', validateId('id'), c.getById);
router.post('/', validateBody(reglas), c.create);
router.put('/:id', validateId('id'), validateBody(reglas), c.update);
router.delete('/:id', validateId('id'), c.remove);

module.exports = router;
