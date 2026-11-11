const AppError = require('../utils/AppError');

const MAX_INT = 2147483647;

// valida que un parámetro de la url sea un entero positivo
const validateId = (...nombres) => (req, res, next) => {
  for (const nombre of nombres) {
    const valor = req.params[nombre];
    if (!/^\d+$/.test(valor) || Number(valor) < 1 || Number(valor) > MAX_INT) {
      return next(
        new AppError(`El parámetro "${nombre}" debe ser un entero positivo`, 400)
      );
    }
  }
  next();
};

// Valida que un parámetro de la URL sea texto no vacio
const validateText = (nombre, max = 100) => (req, res, next) => {
  const valor = (req.params[nombre] || '').trim();
  if (!valor || valor.length > max) {
    return next(
      new AppError(`El parámetro "${nombre}" es obligatorio (máx. ${max} caracteres)`, 400)
    );
  }
  req.params[nombre] = valor;
  next();
};


const validateBody = (reglas) => (req, res, next) => {
  const errores = [];
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  for (const [campo, r] of Object.entries(reglas)) {
    let valor = body[campo];
    const vacio =
      valor === undefined ||
      valor === null ||
      (typeof valor === 'string' && valor.trim() === '');

    if (vacio) {
      if (r.required) errores.push(`"${campo}" es obligatorio`);
      delete body[campo];
      continue;
    }

    if (r.type === 'integer') {
      if (typeof valor === 'string' && /^\d+$/.test(valor)) valor = Number(valor);
      const min = r.min ?? 1;
      const max = r.max ?? MAX_INT;
      if (!Number.isInteger(valor) || valor < min || valor > max) {
        errores.push(`"${campo}" debe ser un entero entre ${min} y ${max}`);
        continue;
      }
    } else {
      if (typeof valor !== 'string') {
        errores.push(`"${campo}" debe ser texto`);
        continue;
      }
      valor = valor.trim();
      if (r.min && valor.length < r.min) {
        errores.push(`"${campo}" debe tener al menos ${r.min} caracteres`);
        continue;
      }
      if (r.max && valor.length > r.max) {
        errores.push(`"${campo}" no puede superar ${r.max} caracteres`);
        continue;
      }
    }
    body[campo] = valor;
  }

  if (errores.length) {
    return next(new AppError('Datos inválidos', 400, errores));
  }
  req.body = body;
  next();
};

module.exports = { validateId, validateText, validateBody };
