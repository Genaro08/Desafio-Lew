const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de verificación básica de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Orbital 2.0 operativo' });
});

module.exports = app;
