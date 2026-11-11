const bcrypt = require('bcryptjs');
const db = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const ensureExists = require('../utils/ensureExists');

// nunca se devuelve la columna clave
const SELECT_BASE = `
  SELECT u.usuarioId AS "usuarioId", u.rolId AS "rolId", r.rol,
         u.nombreUsuario AS "nombreUsuario", u.nombre, u.apellido
  FROM usuarios u
  JOIN roles r ON r.rolId = u.rolId`;

const obtenerPorId = async (id) => {
  const { rows } = await db.query(`${SELECT_BASE} WHERE u.usuarioId = $1`, [id]);
  if (rows.length === 0) throw new AppError(`Usuario con id ${id} no existe`, 404);
  return rows[0];
};

// get api usuarios
exports.getAll = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`${SELECT_BASE} ORDER BY u.usuarioId`);
  res.json({ ok: true, data: rows });
});

// get api usuarios por id 
exports.getById = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: await obtenerPorId(req.params.id) });
});

// post api usuarios
exports.create = asyncHandler(async (req, res) => {
  const { rolId, nombreUsuario, clave, nombre, apellido } = req.body;
  const hash = await bcrypt.hash(clave, 10);
  const { rows } = await db.query(
    `INSERT INTO usuarios (rolId, nombreUsuario, clave, nombre, apellido)
     VALUES ($1, $2, $3, $4, $5) RETURNING usuarioId AS "usuarioId"`,
    [rolId, nombreUsuario, hash, nombre, apellido]
  );
  res.status(201).json({ ok: true, data: await obtenerPorId(rows[0].usuarioId) });
});

// put api usuarios por id (si no se envía clave, se conserva la actual)
exports.update = asyncHandler(async (req, res) => {
  const { rolId, nombreUsuario, clave, nombre, apellido } = req.body;
  const hash = clave ? await bcrypt.hash(clave, 10) : null;
  const { rowCount } = await db.query(
    `UPDATE usuarios
     SET rolId = $1, nombreUsuario = $2, nombre = $3, apellido = $4,
         clave = COALESCE($5, clave)
     WHERE usuarioId = $6`,
    [rolId, nombreUsuario, nombre, apellido, hash, req.params.id]
  );
  if (rowCount === 0) {
    throw new AppError(`Usuario con id ${req.params.id} no existe`, 404);
  }
  res.json({ ok: true, data: await obtenerPorId(req.params.id) });
});

// delete api usuarios por id
exports.remove = asyncHandler(async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM usuarios WHERE usuarioId = $1', [
    req.params.id,
  ]);
  if (rowCount === 0) {
    throw new AppError(`Usuario con id ${req.params.id} no existe`, 404);
  }
  res.json({ ok: true, message: 'Usuario eliminado correctamente' });
});

// get api usuarios por nombre
exports.getByNombre = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `${SELECT_BASE} WHERE u.nombre ILIKE $1 ORDER BY u.usuarioId`,
    [`%${req.params.nombre}%`]
  );
  res.json({ ok: true, data: rows });
});

// get api usuarios api por apellido 
exports.getByApellido = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `${SELECT_BASE} WHERE u.apellido ILIKE $1 ORDER BY u.usuarioId`,
    [`%${req.params.apellido}%`]
  );
  res.json({ ok: true, data: rows });
});

// get api usuarios por rolId
exports.getByRol = asyncHandler(async (req, res) => {
  await ensureExists('roles', 'rolId', req.params.rolId, 'Rol');
  const { rows } = await db.query(
    `${SELECT_BASE} WHERE u.rolId = $1 ORDER BY u.usuarioId`,
    [req.params.rolId]
  );
  res.json({ ok: true, data: rows });
});
