const express = require('express');
const cors = require('cors');
const atencionRoutes = require('./routes/atencionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de verificación básica de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Orbital 2.0 operativo' });
});

// Rutas de la API
app.use('/api', atencionRoutes);

module.exports = app;
