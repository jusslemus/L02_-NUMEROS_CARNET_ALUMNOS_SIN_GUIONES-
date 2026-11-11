// Envuelve controladores async para que cualquier error llegue al manejador central.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
