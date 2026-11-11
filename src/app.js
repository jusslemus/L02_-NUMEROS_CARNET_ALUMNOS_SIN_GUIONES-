const express = require('express');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Web API blogDB funcionando', docs: '/api' });
});

app.use('/api', routes);

// manejador de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
