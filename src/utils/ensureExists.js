const db = require('../config/db');
const AppError = require('./AppError');

// Solo se llama con tabla/columna escritas en el código (nunca desde la petición).
module.exports = async (tabla, columnaId, id, etiqueta) => {
  const { rowCount } = await db.query(
    `SELECT 1 FROM ${tabla} WHERE ${columnaId} = $1`,
    [id]
  );
  if (rowCount === 0) {
    throw new AppError(`${etiqueta} con id ${id} no existe`, 404);
  }
};
