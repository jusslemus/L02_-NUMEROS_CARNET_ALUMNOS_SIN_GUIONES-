const router = require('express').Router();

router.use('/roles', require('./roles.routes'));
router.use('/usuarios', require('./usuarios.routes'));
router.use('/publicaciones', require('./publicaciones.routes'));
router.use('/comentarios', require('./comentarios.routes'));

module.exports = router;
