const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// get api roles sirve para conocer los rolId al crear usuarios
exports.getAll = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    'SELECT rolId AS "rolId", rol FROM roles ORDER BY rolId'
  );
  res.json({ ok: true, data: rows });
});
