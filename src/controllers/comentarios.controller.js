const db = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const ensureExists = require('../utils/ensureExists');

const SELECT_BASE = `
  SELECT c.comentarioId AS "comentarioId", c.publicacionId AS "publicacionId",
         c.comentario, c.usuarioId AS "usuarioId",
         u.nombre || ' ' || u.apellido AS autor
  FROM comentarios c
  JOIN usuarios u ON u.usuarioId = c.usuarioId`;

const obtenerPorId = async (id) => {
  const { rows } = await db.query(`${SELECT_BASE} WHERE c.comentarioId = $1`, [id]);
  if (rows.length === 0) throw new AppError(`Comentario con id ${id} no existe`, 404);
  return rows[0];
};

// get comentarios
exports.getAll = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`${SELECT_BASE} ORDER BY c.comentarioId`);
  res.json({ ok: true, data: rows });
});

// get comentario por id
exports.getById = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: await obtenerPorId(req.params.id) });
});

// post comentarios
exports.create = asyncHandler(async (req, res) => {
  const { publicacionId, comentario, usuarioId } = req.body;
  const { rows } = await db.query(
    `INSERT INTO comentarios (publicacionId, comentario, usuarioId)
     VALUES ($1, $2, $3) RETURNING comentarioId AS "comentarioId"`,
    [publicacionId, comentario, usuarioId]
  );
  res.status(201).json({ ok: true, data: await obtenerPorId(rows[0].comentarioId) });
});

// putapi comentarios id 
exports.update = asyncHandler(async (req, res) => {
  const { publicacionId, comentario, usuarioId } = req.body;
  const { rowCount } = await db.query(
    `UPDATE comentarios SET publicacionId = $1, comentario = $2, usuarioId = $3
     WHERE comentarioId = $4`,
    [publicacionId, comentario, usuarioId, req.params.id]
  );
  if (rowCount === 0) {
    throw new AppError(`Comentario con id ${req.params.id} no existe`, 404);
  }
  res.json({ ok: true, data: await obtenerPorId(req.params.id) });
});

// delete api comentarios id
exports.remove = asyncHandler(async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM comentarios WHERE comentarioId = $1', [
    req.params.id,
  ]);
  if (rowCount === 0) {
    throw new AppError(`Comentario con id ${req.params.id} no existe`, 404);
  }
  res.json({ ok: true, message: 'Comentario eliminado correctamente' });
});

// get api comentarios por publicacion con id
exports.getByPublicacion = asyncHandler(async (req, res) => {
  await ensureExists('publicaciones', 'publicacionId', req.params.publicacionId, 'Publicación');
  const { rows } = await db.query(
    `${SELECT_BASE} WHERE c.publicacionId = $1 ORDER BY c.comentarioId`,
    [req.params.publicacionId]
  );
  res.json({ ok: true, data: rows });
});

// get api comentarios por usuario con id 
exports.getByUsuario = asyncHandler(async (req, res) => {
  await ensureExists('usuarios', 'usuarioId', req.params.usuarioId, 'Usuario');
  const { rows } = await db.query(
    `${SELECT_BASE} WHERE c.usuarioId = $1 ORDER BY c.comentarioId`,
    [req.params.usuarioId]
  );
  res.json({ ok: true, data: rows });
});
