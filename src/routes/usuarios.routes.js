const router = require('express').Router();
const c = require('../controllers/usuarios.controller');
const { validateId, validateText, validateBody } = require('../middlewares/validate');

const reglasCrear = {
  rolId: { type: 'integer', required: true },
  nombreUsuario: { type: 'string', required: true, min: 3, max: 50 },
  clave: { type: 'string', required: true, min: 6, max: 100 },
  nombre: { type: 'string', required: true, max: 100 },
  apellido: { type: 'string', required: true, max: 100 },
};
// en la actualizacion la clave no es obligatoria 
const reglasActualizar = { ...reglasCrear, clave: { ...reglasCrear.clave, required: false } };

// consultas especificas antes de id 
router.get('/nombre/:nombre', validateText('nombre'), c.getByNombre);
router.get('/apellido/:apellido', validateText('apellido'), c.getByApellido);
router.get('/rol/:rolId', validateId('rolId'), c.getByRol);

// CRUD
router.get('/', c.getAll);
router.get('/:id', validateId('id'), c.getById);
router.post('/', validateBody(reglasCrear), c.create);
router.put('/:id', validateId('id'), validateBody(reglasActualizar), c.update);
router.delete('/:id', validateId('id'), c.remove);

module.exports = router;
