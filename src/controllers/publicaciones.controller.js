const db = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const ensureExists = require('../utils/ensureExists');

const SELECT_BASE = `
  SELECT p.publicacionId AS "publicacionId", p.titulo, p.descripcion,
         p.usuarioId AS "usuarioId",
         u.nombre || ' ' || u.apellido AS autor
  FROM publicaciones p
  JOIN usuarios u ON u.usuarioId = p.usuarioId`;

const obtenerPorId = async (id) => {
  const { rows } = await db.query(`${SELECT_BASE} WHERE p.publicacionId = $1`, [id]);
  if (rows.length === 0) throw new AppError(`Publicación con id ${id} no existe`, 404);
  return rows[0];
};

// get api publicaciones
exports.getAll = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`${SELECT_BASE} ORDER BY p.publicacionId`);
  res.json({ ok: true, data: rows });
});

// get api publicaciones por id 
exports.getById = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: await obtenerPorId(req.params.id) });
});

// post api por publicaciones
exports.create = asyncHandler(async (req, res) => {
  const { titulo, descripcion, usuarioId } = req.body;
  const { rows } = await db.query(
    `INSERT INTO publicaciones (titulo, descripcion, usuarioId)
     VALUES ($1, $2, $3) RETURNING publicacionId AS "publicacionId"`,
    [titulo, descripcion ?? null, usuarioId]
  );
  res.status(201).json({ ok: true, data: await obtenerPorId(rows[0].publicacionId) });
});

// put api publicaciones por id
exports.update = asyncHandler(async (req, res) => {
  const { titulo, descripcion, usuarioId } = req.body;
  const { rowCount } = await db.query(
    `UPDATE publicaciones SET titulo = $1, descripcion = $2, usuarioId = $3
     WHERE publicacionId = $4`,
    [titulo, descripcion ?? null, usuarioId, req.params.id]
  );
  if (rowCount === 0) {
    throw new AppError(`Publicación con id ${req.params.id} no existe`, 404);
  }
  res.json({ ok: true, data: await obtenerPorId(req.params.id) });
});

// delete api publicaciones por id (sus comentarios y calificaciones se borran en cascada)
exports.remove = asyncHandler(async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM publicaciones WHERE publicacionId = $1',
    [req.params.id]
  );
  if (rowCount === 0) {
    throw new AppError(`Publicación con id ${req.params.id} no existe`, 404);
  }
  res.json({ ok: true, message: 'Publicación eliminada correctamente' });
});

// get api publicaciones por usuario con id
exports.getByUsuario = asyncHandler(async (req, res) => {
  await ensureExists('usuarios', 'usuarioId', req.params.usuarioId, 'Usuario');
  const { rows } = await db.query(
    `${SELECT_BASE} WHERE p.usuarioId = $1 ORDER BY p.publicacionId`,
    [req.params.usuarioId]
  );
  res.json({ ok: true, data: rows });
});

// get api publicaciones top N con más comentarios
exports.getTop = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.publicacionId AS "publicacionId", p.titulo, p.descripcion,
            p.usuarioId AS "usuarioId",
            COUNT(c.comentarioId)::int AS "cantidadComentarios"
     FROM publicaciones p
     LEFT JOIN comentarios c ON c.publicacionId = p.publicacionId
     GROUP BY p.publicacionId
     ORDER BY "cantidadComentarios" DESC, p.publicacionId
     LIMIT $1`,
    [req.params.n]
  );
  res.json({ ok: true, data: rows });
});
